var arango = require('arangojs');
const config = require('../config')
var db = null 
const logger = require('../utils/logger').logger('arango');
//////////////////////////////////////////////////////////////////
function init(){
    if(db == null){
        Database = arango.Database;
        db = new Database(`http://${config.arangoHost}:${config.arangoPort}`);
        db.useDatabase('waterDrop');
        db.useBasicAuth(config.arangoUser, config.arangoPassword)
    }
    return db
}

const  courseTableCollection = "courseTable2"

function convert_to_courseId(userId){
    var openId = (userId.length == 28) ? userId : userId.replace("_D_", "-")
    return "weixin_" + openId
}

async function getCourseTable(userId, weekday){
    var courseId = convert_to_courseId(userId)
    return await db.query(`FOR doc IN ${courseTableCollection} filter doc._key=='${courseId}' return doc.courseTable.${weekday} `).then(cursor => cursor.all())
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
