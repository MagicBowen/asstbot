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

function convert_to_openId(userId){
    var openId = (userId.length == 28) ? userId : userId.replace("_D_", "-")
    return openId
}

//////////////////////////////////////////////////////////////////
async function getCourseId(userId) {
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
    var courseId = await getCourseId(userId)
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
    var courseId = await getCourseId(userId)
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
    delete userInfo._id
    delete userInfo.id
    delete userInfo.__v
    doc.userInfo = userInfo
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


module.exports={
    init,
    getDayCourseForUser,
    queryAllCourseForUser,
    saveFeedbackForUser
}
