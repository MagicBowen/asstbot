const arangoDb = require("./arangoDb.js")
var db = arangoDb.getDb() 
const logger = require('../utils/logger').logger('arango');

const  courseTableCollection = "courseTable2"
const  userIdsCollection = "userIds"
const  feedbackCollection = "userFeedbacks"
const  dictateWordsCollection = "dictateWords"
const  waitingBindingCollection = "waitingBindingAccount" 


//////////////////////////////////////////////////////////////////
async function getDayCourseForUser(userId, weekday){
    var courseId = await arangoDb.getDarwinId(userId)
    var aql = `FOR doc IN ${courseTableCollection} filter doc._key=='${courseId}' return doc.courseTable.${weekday}`
    logger.info('execute aql', aql)
    return await arangoDb.querySingleDoc(aql)
}

//////////////////////////////////////////////////////////////////
async function queryAllCourseForUser(userId) {
    var courseId = await arangoDb.getDarwinId(userId)
    var aql = `FOR doc IN ${courseTableCollection} filter doc._key=='${courseId}' return doc.courseTable`
    logger.info('execute aql', aql)
    return await arangoDb.querySingleDoc(aql)
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
        meta => { logger.info('Document saved:', meta._key); return meta._key },
        err => { logger.error('Failed to save document:', err); return "" }
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
    var darwinId = await arangoDb.getDarwinId(openId)
    dictateWords.darwinId = darwinId
    dictateWords.timestamp = getTimeStamp()
    dictateWords.createTime = getlocalDateString()
    dictateWords.updateTime = getlocalDateString()
    var collection = db.collection(dictateWordsCollection)
    var dictateWordsId = await collection.save(dictateWords).then(
        meta => { logger.info('dictate words saved:', meta._key); return meta._key },
        err => { logger.error('Failed to save dictate words:', err); return "" }
    );
    return dictateWordsId
}

//////////////////////////////////////////////////////////////////
async function updateDicateWords(dictateWordsId, dictateWords){
    var collection = db.collection(dictateWordsCollection)
    dictateWords.updateTime = getlocalDateString()
    var dictateWordsId = await collection.update(dictateWordsId, dictateWords).then(
        meta => { logger.info('dictate words udpated:', meta._key); return meta._key },
        err => { logger.error('Failed to udpate dictate words:', err); return "" }
    );
    return dictateWordsId
}

//////////////////////////////////////////////////////////////////
async function deleteDictateWords(dictateWordsId){
    var collection = db.collection(dictateWordsCollection)
    await collection.remove(dictateWordsId).then(
        () => logger.info('dictateWords doc removed'),
        err => logger.error('Failed to remove dictateWords', err)
    );
    return dictateWordsId
}

//////////////////////////////////////////////////////////////////
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
    var darwinId = await arangoDb.getDarwinId(openId)
    var aql = `FOR doc in ${dictateWordsCollection} filter doc.darwinId == '${darwinId}' SORT doc.timestamp DESC return doc`
    return await db.query(aql).then(cursor => cursor.all())
    .then(wordsList => { return wordsList.map(function(doc){
        return formatDictateWords(doc)
    })},
    err => {
        logger.error('Failed to fetch agent document:')
        return []
    })
}

//////////////////////////////////////////////////////////////////
async function getActiveDictationWords(openId){
    var darwinId = await arangoDb.getDarwinId(openId)
    var aql = `FOR doc in ${dictateWordsCollection} filter doc.darwinId == '${darwinId}' and doc.active == true return doc.words`
    logger.info("query aql: ", aql)
    return await db.query(aql).then(cursor => cursor.all())
    .then(wordsList => {if(wordsList.length == 0){
        return []
    }else{
        return wordsList[0]
    }},
    err => {
        logger.error('Failed to fetch agent document:')
        return []
    })
}
//////////////////////////////////////////////////////////////////
async function getTodayHoroscope (sign) {
    var aql = `let today = DATE_FORMAT(DATE_ADD(DATE_NOW(), 8, 'hours'), '%yyyy%mm%dd')
    for doc in dayHoroscope
        let day = TO_STRING(doc.date)
        filter day == today && doc.name == '${sign}'
        return doc`

    return await arangoDb.querySingleDoc(aql)
}

//////////////////////////////////////////////////////////////////
async function getTomorrowHoroscope (sign) {
    var aql = `let tomorrow = DATE_FORMAT(DATE_ADD(DATE_NOW(), 32, 'hours'), '%yyyy%mm%dd')
    for doc in tomorrowHoroscope
        let day = TO_STRING(doc.date)
        filter day == tomorrow && doc.name == '${sign}'
        return doc`

    return await arangoDb.querySingleDoc(aql)
}

async function getWeekHoroscope (sign) {
    var aql = `let week = DATE_ISOWEEK(DATE_ADD(DATE_NOW(), 8, 'hours'))
    for doc in weekHoroscope
        filter doc.weekth == week && doc.name == '${sign}'
        return doc`

    return await arangoDb.querySingleDoc(aql)
}

async function getMonthHoroscope (sign) {
    var aql = `let month = DATE_MONTH(DATE_ADD(DATE_NOW(), 8, 'hours'))
    for doc in monthHoroscope
        filter doc.month == month && doc.name == '${sign}'
        return doc`

    return await arangoDb.querySingleDoc(aql)
}

async function getHoroscope (day, sign) {
    var aql = `let today = DATE_FORMAT(DATE_ISO8601('${day}'), '%yyyy%mm%dd')
    for doc in dayHoroscope
    let day = TO_STRING(doc.date)
    filter day == today && doc.name == '${sign}'
    return doc`
    
    return await arangoDb.querySingleDoc(aql)
}

//////////////////////////////////////////////////////////////////
function getTimeStamp(){
    var date = new Date()
    return parseInt(date.getTime() / 1000)
}

//////////////////////////////////////////////////////////////////
async function getUserKey(openId, darwinId){
    var aql = `FOR user in ${userIdsCollection} filter user.openId == '${openId}' and user.courseId == '${darwinId}' return user._key`
    logger.info('execute aql', aql)
    return await arangoDb.querySingleDoc(aql)
}

//////////////////////////////////////////////////////////////////
async function updateBindingUser(openId, user){
    var darwinId = await arangoDb.getDarwinId(openId)
    var userKey = await getUserKey(openId, darwinId)

    var bindingInfo = {}
    bindingInfo[getIdName(user.userType, user.skill)] = user.userId
    bindingInfo.openId = openId
    bindingInfo.courseId = darwinId

    var collection = db.collection(userIdsCollection)
    logger.info('update user key', userKey, "user info",JSON.stringify(bindingInfo))
    var key = await collection.update(userKey, bindingInfo).then(
        meta => { logger.info('update binding user success:', meta._key); return meta._key },
        err => { logger.error('Failed to binding user:', err); return "" }
    )
    return key != ""
}


//////////////////////////////////////////////////////////////////
async function removeWaitingBindingUser(user){
    var collection  = db.collection(waitingBindingCollection)
    await collection.remove(user._key).then(
        () => logger.info('delete waiting binding user success'),
        err => logger.error('remove waiting bing user fail', err)
    );
}

//////////////////////////////////////////////////////////////////
async function getBindingUserType(openId) {
    var aql = `FOR user in ${userIdsCollection} filter user.openId == '${openId}' return user`
    logger.info('execute aql', aql)
    var user = await arangoDb.querySingleDoc(aql)
    if (user == null){
        return []
    }
    var bindingUserType = []
    if ("xiaomiId" in user) {
        if(user.xiaomiId != ""){
            bindingUserType.push("xiaoai")
        }
    }

    if ("duerosId" in user) {
        if(user.duerosId != ""){
            bindingUserType.push("dueros")
        }
    }

    if ("huaweiId" in user) {
        if(user.duerosId != ""){
            bindingUserType.push("huawei")
        }
    }

    if("dingdongId" in user) {
        if(user.dingdongId != ""){
            bindingUserType.push("dingdong")
        }
    }
    return bindingUserType 
}

//////////////////////////////////////////////////////////////////
function getBindingUserTypesBy(user){
    var bindingUserType = []
    for(var key in user){
        if(key == "xiaomiId" && user[key] != ""){
            bindingUserType.push({platType: "xiaoai"})
            continue
        }
        if(key == "duerosId" && user[key] != ""){
            bindingUserType.push({platType: "dueros"})
            continue
        }

        if(key == "huaweiId" && user[key] != ""){
            bindingUserType.push({platType: "huawei"})
            continue
        }

        if(key == "dingdongId" && user[key] != ""){
            bindingUserType.push({platType: "dingdong", skill: "course-record"})
            continue
        }

        if(key.indexOf("dingdong") >=0 && user[key]!= ""){
            var strs = key.split("_")
            if(strs.length != 3){
                continue
            }
            bindingUserType.push({platType: "dingdong", skill: strs[1]})
        }

    }

    return bindingUserType
}


//////////////////////////////////////////////////////////////////
async function getBindingPlat(openId){
    var aql = `FOR user in ${userIdsCollection} filter user.openId == '${openId}' return user`
    logger.info('execute aql', aql)
    var user = await arangoDb.querySingleDoc(aql)
    if (user == null){
        return []
    }
    return getBindingUserTypesBy(user)
}

//////////////////////////////////////////////////////////////////
function generateBindingCode(){
    return Math.floor(Math.random()*90000) + 10000
}

//////////////////////////////////////////////////////////////////
async function addWaitingBinding(userId, skill, platform){
    var bindingCode = generateBindingCode()
    var doc = {}
    doc.userId = userId
    doc.skill = skill
    doc.userType = platform
    doc.timestamp = getTimeStamp()
    doc.bindingCode = bindingCode
    var collection  = db.collection(waitingBindingCollection)
    await collection.save(doc).then(
        meta => { logger.info('Document saved:', meta._key); return meta._key },
        err => { logger.error('Failed to save document:', err); return "" }
    );
    return bindingCode
}

//////////////////////////////////////////////////////////////////
function isBindingCodeExpired(timeStamp){
    var curTimeStamp = getTimeStamp()
    return (curTimeStamp - timeStamp) > 300
}

//////////////////////////////////////////////////////////////////
async function queryByAql(aql){
    return await db.query(aql).then(cursor => cursor.all())
    .then(result => {
        return result
    },
    err => {
        logger.error('Failed to fetch binding user')
        return []
    })
}

function isEmpty(users){
    for (var name in users){
        logger.info("comming here ..........")
        return false
    }
    return true
}

//////////////////////////////////////////////////////////////////
async function getBindingCodeFor(userId, platform, skill){
    var aql = `for doc in ${waitingBindingCollection} 
    filter doc.userId == '${userId}'  and doc.userType =='${platform}' and doc.skill =='${skill}'
    return doc `
    logger.info('query binding user aql', aql)
    var waitingUsers = await queryByAql(aql)
    if(isEmpty(waitingUsers)){
        return await addWaitingBinding(userId, skill, platform)
    }
    var bindingUser = waitingUsers[0]
    if(isBindingCodeExpired(bindingUser.timestamp)){
        await removeWaitingBindingUser(bindingUser)
        return await addWaitingBinding(userId, skill, platform)
    }
    return bindingUser.bindingCode
}

//////////////////////////////////////////////////////////////////
async function bindingUser(openId, bindingCode, userType, skill){
    var timeStamp = getTimeStamp()
    var expireTimeStamp = timeStamp - 300
    var aql = `for doc in ${waitingBindingCollection} 
    filter doc.bindingCode == ${bindingCode}  and doc.userType =='${userType}' and doc.timestamp > ${expireTimeStamp}
    return doc `
    if(skill){
        aql = `for doc in ${waitingBindingCollection} 
            filter doc.bindingCode == ${bindingCode}  and doc.userType =='${userType}' and doc.skill == '${skill}' and doc.timestamp > ${expireTimeStamp}
            return doc `
    }
    
    logger.info('query binding user aql', aql)
    var bindingUsers = await queryByAql(aql)
    if (isEmpty(bindingUsers)){
        logger.error('waiting binding user infos is ', JSON.stringify(bindingUsers))
        return false
    }
    var user = bindingUsers[0]
    var ret = await updateBindingUser(openId, user)
    if(ret){
        await removeWaitingBindingUser(user)
    }
    return ret
}

//////////////////////////////////////////////////////////////////
function getIdNameForDingDong(skill){
    if(!skill){
        return "dingdongId"
    }
    if(skill == "course-record"){
        return "dingdongId"
    }
    return "dingdong_" + skill+ "_Id"
}

//////////////////////////////////////////////////////////////////
function getIdName(userType, skill){
    if(userType == 'xiaoai'){
        return "xiaomiId"
    }
    if(userType == 'dueros'){
        return "duerosId"
    }
    if(userType == 'dingdong'){
        return getIdNameForDingDong(skill)
    }
    return userType + "Id"
}

//////////////////////////////////////////////////////////////////
async function unBindingUser(openId, userType, skill){
    var idName = getIdName(userType, skill)
    var aql = `for doc in ${userIdsCollection}
               filter doc.openId== '${openId}'
               update doc with {
                   ${idName}: ""
               } into ${userIdsCollection}`
    return await arangoDb.updateDoc(aql)
}


//////////////////////////////////////////////////////////////////
async function getLaohuangli (day) {
    var aql = `for doc in laohuangli
    filter doc.yangli == "${day}"
    limit 1
    return doc`

    return await arangoDb.querySingleDoc(aql)
}

//////////////////////////////////////////////////////////////////
async function getLunar (lunarYear, lunarMonth, lunarDay, leap) {
    var aql = `for doc in lunar
        filter doc.lunarYear == ${lunarYear} and doc.lunarMonth == ${lunarMonth} and doc.lunarDay == ${lunarDay} and doc.leap == ${leap}
        return doc
    `
    return await arangoDb.querySingleDoc(aql)
}

//////////////////////////////////////////////////////////////////
function addFormId (openId, formId) {
    var aql = `UPSERT { openId: '${openId}' } 
    INSERT { openId: '${openId}', dataCreated: DATE_NOW(),  formIds: [{formId: '${formId}', timestamp: DATE_NOW()}] } 
    UPDATE { formIds:APPEND(OLD.formIds,{formId: '${formId}', timestamp: DATE_NOW()}) } IN wechatFormId
    `
    db.query(aql)
    return
}

//////////////////////////////////////////////////////////////////
async function getFormId (openId) {
    var aql = `for FormId in wechatFormId
    filter FormId.openId == '${openId}'
    let date = DATE_SUBTRACT(DATE_NOW(), 7, "day")
    let formIds = (for id in FormId.formIds
        filter DATE_ISO8601(id.timestamp) > date
        return id)
    filter length(formIds) > 0
    let retVal = FIRST(formIds)
    let newformIds = SHIFT(formIds)
    update FormId with {formIds: newformIds} in wechatFormId
    return retVal`
    return await arangoDb.querySingleDoc(aql)
}

//////////////////////////////////////////////////////////////////
const  userExtrInfo = "userExtrInfo" 
async function updateUserHoroscope(userId, horoscope){
    var darwinId = await arangoDb.getDarwinId(userId)
    var aql = `for doc in ${userExtrInfo}  filter doc._key == '${darwinId}' return doc`
    var ret = await arangoDb.querySingleDoc(aql)
    if(ret == null){
        var doc = {}
        doc._key = darwinId
        doc.horoscope = horoscope
        var collection  = db.collection(userExtrInfo)
        await collection.save(doc).then(
            meta => { logger.info('Document saved:', meta._key); return meta._key },
            err => { logger.error('Failed to save document:', err); return "" }
        );
        return true
    }
    var updateAql = `LET doc = DOCUMENT("${userExtrInfo}/${darwinId}")
                     update doc with {
                        horoscope : '${horoscope}'
                     } in ${userExtrInfo}`

    return await arangoDb.updateDoc(updateAql)
}

//////////////////////////////////////////////////////////////////
async function getUserHoroscope(userId){
    var darwinId = await arangoDb.getDarwinId(userId)
    var aql = `for doc in ${userExtrInfo}  filter doc._key == '${darwinId}' return doc.horoscope`
    return await arangoDb.querySingleDoc(aql)
}

module.exports={
    getDayCourseForUser,
    queryAllCourseForUser,
    saveFeedbackForUser,
    addDictateWords,
    updateDicateWords,
    deleteDictateWords,
    getAllDictateWords,
    getActiveDictationWords,
    getTodayHoroscope,
    getHoroscope,
    getUserHoroscope,
    updateUserHoroscope,
    bindingUser,
    unBindingUser,
    getBindingPlat,
    getBindingUserType,
    getBindingCodeFor,
    getTomorrowHoroscope,
    getWeekHoroscope,
    getMonthHoroscope,
    getLaohuangli,
    getLunar,
    addFormId,
    getFormId
}
