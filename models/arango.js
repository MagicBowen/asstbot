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
    }
    return db
}

const  courseTableCollection = "courseTable2"
const  userIdsCollection = "userIds"

function convert_to_openId(userId){
    var openId = (userId.length == 28) ? userId : userId.replace("_D_", "-")
    return openId
}

async function getCourseId(userId) {
    var openId = convert_to_openId(userId)
    var courseId = "darwin_" + openId
    var aql = `FOR user in ${userIdsCollection} filter user.openId = ${openId} return user.courseId`
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

async function getCourseTable(userId, weekday){
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

module.exports={
    init,
    getCourseTable
}
