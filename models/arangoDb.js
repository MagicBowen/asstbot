var arango = require('arangojs');
var config = require('../config')
const logger = require('../utils/logger').logger('arangoDb');
var db = null 
const  userIdsCollection = "userIds"

function getDb(){
    logger.info("read config ", JSON.stringify(config))
    if(db == null){
        Database = arango.Database;
        db = new Database(`http://${config.arangoHost}:${config.arangoPort}`);
        db.useDatabase('waterDrop');
        db.useBasicAuth(config.arangoUser, config.arangoPassword)
        logger.info("arango db init success")
    }
    return db
}

function convert_to_openId(userId){
    var openId = (userId.length == 28) ? userId : userId.replace("_D_", "-")
    return openId
}


//////////////////////////////////////////////////////////////////
//此处主要为了解决和遗留数据的兼容问题，所以名字不统一，使用courseId作为darwin平台的统一ID。
async function getDarwinId(userId) {
    var openId = convert_to_openId(userId)
    var aql = `FOR user in ${userIdsCollection} filter user.openId == '${openId}' return user.courseId`
    logger.info('execute aql', aql)
    var darwinId = await db.query(aql).then(cursor => cursor.all())
          .then(users => {
            if(users.length > 0){
                return users[0]
            }
            return null
          }, err => {
             logger.error('Failed to fetch agent document:')
             return null
          })

    if(darwinId == null){
        darwinId = "darwin_" + openId
        await addNewUser(darwinId, openId)
    }
    return darwinId
}

async function addNewUser(darwinId, openId){
    var collection = db.collection(userIdsCollection)
    var user = {}
    //此处主要为了解决和遗留数据的兼容问题，所以名字不统一
    user.courseId = darwinId
    user.openId = openId
    await collection.save(user).then(
        meta => { logger.info('add new user  saved:', meta._key); return meta._key },
        err => { logger.error('Failed to add new user', err); return "" }
    );
}

//////////////////////////////////////////////////////////////////
async function querySingleDoc(aql){
    logger.info("qery aql is: ", aql)
    return await db.query(aql).then(cursor => cursor.all())
    .then(docs => {
        if(docs.length == 0){
            return null
        }else{
            return docs[0]
        }
    },
    err => {
        logger.error('Failed to fetch agent document:')
        return null
    })
}

//////////////////////////////////////////////////////////////////
async function saveDoc(collectionName, doc){
    var collection  = db.collection(collectionName)
    await collection.save(doc).then(
        meta => { logger.info('Document saved:', meta._key); return meta._key },
        err => { logger.error('Failed to save document:', err); return "" }
    );
}

//////////////////////////////////////////////////////////////////
async function updateDoc(aql){
    logger.info("update aql is :", aql)
    return await db.query(aql).then(cursor => cursor.all())
    .then(result => {
        logger.info(`update doc success`)
        return true
    },
    err => {
        logger.error('Failed to update doc')
        return false
    })
}

module.exports={
    getDb,
    getDarwinId,
    querySingleDoc,
    updateDoc,
    saveDoc
}
