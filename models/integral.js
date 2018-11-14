const arangoDb = require("./arangoDb.js")
var config = require('../config')
const logger = require('../utils/logger').logger('integral');
const postJson = require('../utils/postjson');

const integralCollection = "userIntegral"

//////////////////////////////////////////////////////////////////
function getlocalDateString(){
    var myDate = new Date()
    return myDate.toLocaleDateString()
}

//////////////////////////////////////////////////////////////////
function getTimeStamp(){
    var date = new Date()
    return parseInt(date.getTime() / 1000)
}

//////////////////////////////////////////////////////////////////
function buildDoc(darwinId){
    var doc = {}
    doc._key = darwinId
    doc.timestamp = getTimeStamp()
    doc.createTime = getlocalDateString()
    doc.login = []
    doc.dictation = []
    doc.course = []
    doc.horoscope = []
    doc.survey = []
    doc.nongli = []
    doc.state = "active"
    doc.totalScore = 0
    doc.usedScore = 0
    return doc
}

//////////////////////////////////////////////////////////////////
async function startIntegral(openId){
    var queryAql = `for doc in ${integralCollection}  filter doc._key == '${openId}' return doc`
    var doc = await arangoDb.querySingleDoc(queryAql)
    if(doc == null){
        await arangoDb.saveDoc(integralCollection, buildDoc(openId))
    }
    var updateAql = `LET doc = DOCUMENT("${integralCollection}/${openId}")
    update doc with {
       state : 'active'
    } in ${integralCollection}`
    await arangoDb.updateDoc(updateAql)
    return true
}

//////////////////////////////////////////////////////////////////
async function stopIntegral(openId){
    var updateAql = `LET doc = DOCUMENT("${integralCollection}/${openId}")
    update doc with {
       state : 'inActive'
    } in ${integralCollection}`
    return await arangoDb.updateDoc(updateAql)
}

async function addIntegalInfo(openId){
    var queryAql = `for doc in ${integralCollection}  filter doc._key == '${openId}' return doc`
    var doc = await arangoDb.querySingleDoc(queryAql)
    if(doc == null){
        await arangoDb.saveDoc(integralCollection, buildDoc(openId))
    }
}

//////////////////////////////////////////////////////////////////
function buildLoginStatItem(){
    var doc = {}
    doc.day = getlocalDateString()
    doc.timestamp = getTimeStamp()
    doc.collected = false
    return JSON.stringify(doc)
}

//////////////////////////////////////////////////////////////////
async function addStat(event, openId){
    var today = getlocalDateString()
    var updateAql = `for doc in ${integralCollection} 
    filter doc._key == '${openId}' and doc.state == 'active' and LAST(doc.${event}).day != '${today}'
    update doc with {
        ${event}: APPEND(doc.${event}, ${buildLoginStatItem()})
    } in ${integralCollection}`
    return await arangoDb.updateDoc(updateAql)
}

async function statByResponse(userId, response){
    var ret = response.msgs.filter(msg => {
        return msg.type == "redirect" && msg.url == "dictation"
    })
    if (ret.length > 0){
        await addStat("dictation", userId)
    }
}

//////////////////////////////////////////////////////////////////
async function textChatStat(request, response){
    await statByResponse(request.session, response)
    return true
}

//////////////////////////////////////////////////////////////////
async function eventChatStat(request, response){
    var eventName = request.event.name
    var userId = request.session
    if(eventName == "login") {
        await addIntegalInfo(userId)
        await addStat("login", userId)
        return true
    }
    await statByResponse(request.session, response)
    return true
}

async function sendNotifyFor(user){
    var body = {
        hint:  "今天你还没有登陆",
        activity: "打开活动",
        score: 1000,
        openId: user._key,
        day: getlocalDateString()
    }

    var ret = await postJson(config.sendNotifyUrl, body)
    logger.info(`send notify url ${config.sendNotifyUrl} body  ${JSON.stringify(body)} , ret = ${JSON.stringify(ret)}`)
}


//////////////////////////////////////////////////////////////////
async function  notifyUnLoginUsers(){
    var today = getlocalDateString()
    var queryAql = `for doc in ${integralCollection} 
                    let lastLogin = LAST(doc.login)
                    filter lastLogin.day != '${today}' and doc.state == 'active'
                    return doc`
    var users = await arangoDb.queryDocs(queryAql)
    logger.info(`send notify users num is: ${users.length}`)
    users.forEach(user => {
        sendNotifyFor(user)
    });
}


module.exports={
    startIntegral,
    stopIntegral,
    textChatStat,
    eventChatStat,
    notifyUnLoginUsers
}