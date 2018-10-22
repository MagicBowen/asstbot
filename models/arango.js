var arango = require('arangojs');
const config = require('../config')
var db = null 
const logger = require('../utils/logger').logger('arango');
//////////////////////////////////////////////////////////////////
function init(){
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

const  courseTableCollection = "courseTable2"
const  userIdsCollection = "userIds"
const  feedbackCollection = "userFeedbacks"
const  dictateWordsCollection = "dictateWords"

function convert_to_openId(userId){
    var openId = (userId.length == 28) ? userId : userId.replace("_D_", "-")
    return openId
}


//////////////////////////////////////////////////////////////////
async function getDarwinId(userId) {
    var openId = convert_to_openId(userId)
    var courseId = "darwin_" + openId
    var aql = `FOR user in ${userIdsCollection} filter user.openId == '${openId}' return user.courseId`
    logger.info('execute aql', aql)
    await db.query(aql).then(cursor => cursor.all())
          .then(users => {
            if(users.length > 0){
                courseId = users[0]
            }
          }, err => {
             logger.error('Failed to fetch agent document:')
          })
    return courseId
}

//////////////////////////////////////////////////////////////////
async function getDayCourseForUser(userId, weekday){
    var courseId = await getDarwinId(userId)
    var aql = `FOR doc IN ${courseTableCollection} filter doc._key=='${courseId}' return doc.courseTable.${weekday}`
    logger.info('execute aql', aql)
    return await db.query(aql).then(cursor => cursor.all())
    .then(courses => {
        if(courses.length == 0){
            return null
        }else{
            return courses[0]
        }
    },
    err => {
        logger.error('Failed to fetch agent document:')
        return null
    })
}

//////////////////////////////////////////////////////////////////
async function queryAllCourseForUser(userId) {
    var courseId = await getDarwinId(userId)
    var aql = `FOR doc IN ${courseTableCollection} filter doc._key=='${courseId}' return doc.courseTable`
    logger.info('execute aql', aql)
    return await db.query(aql).then(cursor => cursor.all())
    .then(courses => {
        if(courses.length == 0){
            return null
        }else{
            return courses[0]
        }
    },
    err => {
        logger.error('Failed to fetch agent document:')
        return null
    })

}

//////////////////////////////////////////////////////////////////
function buildFeedbackDoc(userId, userInfo, content, contectWay){
    var doc = {}
    doc.userId = userId
    doc.userInfo = {}
    doc.userInfo.wechat = userInfo.wechat
    doc.userInfo.asstBot = userInfo.asstBot
    doc.content = content
    doc.contectWay = contectWay
    return doc
}

//////////////////////////////////////////////////////////////////
async function saveFeedbackForUser(userId, userInfo, content, contectWay){
    var collection = db.collection(feedbackCollection)
    var doc = buildFeedbackDoc(userId, userInfo, content, contectWay)

    var feedbackId = await collection.save(doc).then(
        meta => { console.log('Document saved:', meta._key); return meta._key },
        err => { console.error('Failed to save document:', err); return "" }
    );

    return  feedbackId
}

//////////////////////////////////////////////////////////////////
function getlocalDateString(){
    var myDate = new Date()
    return myDate.toLocaleDateString()
}

//////////////////////////////////////////////////////////////////
async function addDictateWords(openId, dictateWords) {
    var darwinId = await getDarwinId(openId)
    dictateWords.darwinId = darwinId
    dictateWords.createTime = getlocalDateString()
    dictateWords.updateTime = getlocalDateString()
    var collection = db.collection(dictateWordsCollection)
    var dictateWordsId = await collection.save(dictateWords).then(
        meta => { console.log('dictate words saved:', meta._key); return meta._key },
        err => { console.error('Failed to save dictate words:', err); return "" }
    );
    return dictateWordsId
}

//////////////////////////////////////////////////////////////////
async function udpateDictateWords(dictateWordsId, dictateWords){
    var collection = db.collection(dictateWordsCollection)
    dictateWords.updateTime = getlocalDateString()
    var dictateWordsId = await collection.update(dictateWordsId, dictateWords).then(
        meta => { console.log('dictate words udpated:', meta._key); return meta._key },
        err => { console.error('Failed to udpate dictate words:', err); return "" }
    );
    return dictateWordsId
}

//////////////////////////////////////////////////////////////////
async function deleteDictateWords(dictateWordsId){
    var collection = db.collection(dictateWordsCollection)
    await collection.remove(dictateWordsId).then(
        () => console.log('dictateWords doc removed'),
        err => console.error('Failed to remove dictateWords', err)
    );
    return dictateWordsId
}

function formatDictateWords(doc){
    var id = doc._key
    delete doc._key
    delete doc._id
    delete doc._rev
    doc.id = id
    return doc
}

//////////////////////////////////////////////////////////////////
async function getAllDictateWords(openId){
    var darwinId = await getDarwinId(openId)
    var aql = `FOR doc in ${dictateWordsCollection} filter doc.darwinId == '${darwinId}' return doc`
    return await db.query(aql).then(cursor => cursor.all())
    .then(wordsList => { return wordsList.map(function(doc){
        return formatDictateWords(doc)
    })},
    err => {
        logger.error('Failed to fetch agent document:')
        return []
    })
}

module.exports={
    init,
    getDayCourseForUser,
    queryAllCourseForUser,
    saveFeedbackForUser,
    addDictateWords,
    udpateDictateWords,
    deleteDictateWords,
    getAllDictateWords
}
