var arango = require('arangojs');
var config = require('../config')
const logger = require('../utils/logger').logger('arangoDb');
var db = null 
const  userIdsCollection = "userIds"

function getDb(){
    logger.info("read config ", JSON.stringify(config))
    if(db == null){
        db = arangoDbBase.getDb('waterDrop')
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
async function queryDocs(aql){
    return await arangoDbBase.queryDocs(db, aql)
}


//////////////////////////////////////////////////////////////////
async function querySingleDoc(aql){
    return await arangoDbBase.querySingleDoc(db, aql)
}

//////////////////////////////////////////////////////////////////
async function saveDoc(collectionName, doc){
    return await arangoDbBase.saveDoc(db, collectionName, doc)
}

//////////////////////////////////////////////////////////////////
async function updateDoc(aql){
    return await arangoDbBase.updateDoc(db, aql)
}

module.exports={
    getDb,
    getDarwinId,
    querySingleDoc,
    updateDoc,
    queryDocs,
    saveDoc
}
