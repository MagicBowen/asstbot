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

function getlocalTimeString(){
    return new Date().toLocaleString()
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
    doc.createTime = getlocalTimeString()
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
        return true
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

//////////////////////////////////////////////////////////////////
async function addIntegalInfo(openId){
    var queryAql = `for doc in ${integralCollection}  filter doc._key == '${openId}' return doc`
    var doc = await arangoDb.querySingleDoc(queryAql)
    if(doc == null){
        await arangoDb.saveDoc(integralCollection, buildDoc(openId))
    }
    return true
}

//////////////////////////////////////////////////////////////////
var _event_score_rule={
    "login": {
        score:  10,
    },
    "dictation": {
        score: 5
    }
}

//////////////////////////////////////////////////////////////////
function clacAddScore(event, lastDay){
    if(event in  _event_score_rule){
        return _event_score_rule[event].score
    }
    return 0
}

//////////////////////////////////////////////////////////////////
function buildLastEventItem(event, lastDay){
    var doc = {}
    doc.day = getlocalDateString()
    doc.time = getlocalTimeString()
    doc.name = event
    doc.lastDay = lastDay + 1
    return JSON.stringify(doc)
}

//////////////////////////////////////////////////////////////////
async function doUpdateIntegal(event, openId, lastDay){
    var addScore = clacAddScore(event, lastDay)
    var lastEventItem = buildLastEventItem(event, lastDay)
    var updateAql = `LET doc = DOCUMENT("${integralCollection}/${openId}")
                    update doc with {
                        ${event}: APPEND(doc.${event}, ${lastEventItem}),
                        totalScore: doc.totalScore + ${addScore}
                    } in ${integralCollection}`
    return await arangoDb.updateDoc(updateAql)
}

//////////////////////////////////////////////////////////////////
async function addStatNew(event, openId){
    var today = getlocalDateString()
    var queryAql = `for doc in ${integralCollection} 
    filter doc._key == '${openId}'
    return LAST(doc.${event})`
    var doc = await arangoDb.querySingleDoc(queryAql)
    if(doc == null){
        return await doUpdateIntegal(event, openId, 0)
    }
    if(doc.day == today){
        return true
    }
    return await doUpdateIntegal(event, openId, doc.lastDay)
}

//////////////////////////////////////////////////////////////////
async function statByResponse(userId, response){
    var ret = response.msgs.filter(msg => {
        return msg.type == "redirect" && msg.url == "dictation"
    })
    if (ret.length > 0){
        await addStatNew("dictation", userId)
    }
}

//////////////////////////////////////////////////////////////////
async function addNewDictationStat(userId){
    await addStatNew("dictation", userId)
}

//////////////////////////////////////////////////////////////////
async function textChatStat(request, response){
    // await statByResponse(request.session, response)
    return true
}

//////////////////////////////////////////////////////////////////
async function eventChatStat(request, response){
    var eventName = request.event.name
    var userId = request.session
    if(eventName == "login") {
        await addIntegalInfo(userId)
        await addStatNew("login", userId)
        return true
    }
    // await statByResponse(request.session, response)
    return true
}

//////////////////////////////////////////////////////////////////
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

const luckyDrawScore = 200

async function queryUserIntegral(openId){
    var queryAql = `for doc in ${integralCollection} 
    filter doc._key == '${openId}'
    return doc`
    var doc = await arangoDb.querySingleDoc(queryAql)
    if(doc == null){
        return {totalScore: 0, usedScore: 0}
    }
    var ret = {}
    ret.totalScore = doc.totalScore,
    ret.usedScore = doc.usedScore,
    ret.drawTimes = Math.floor((doc.totalScore - doc.usedScore)/luckyDrawScore)
    return ret
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

async function deductIntegral(openId){
    var aql =  `for doc in ${integralCollection}
                filter doc._key=='${openId}' and doc.remainScore >= ${luckyDrawScore}
                UPDATE doc with{
                remainScore: doc.remainScore-${luckyDrawScore},
                } in ${integralCollection}
                LET previous = OLD 
                RETURN previous._key`

    var ret = await arangoDb.querySingleDoc(aql)
    return ret != null
}

//////////////////////////////////////////////////////////////////
async function doLuckyDraw(openId){
    var deductFlag =   deductIntegral(openId)
    if(deductFlag){
        var luckyNum = Math.floor(Math.random()*10)
        var ret = {}
        if(luckyNum == 1){
            ret.grand = 2
            var flag = await allocAwardFor(openId, ret.grand)
            if(flag){
                return ret
            }       
        }
        ret.grand = 0
        await allocAwardFor(openId, ret.grand)
        return ret
    }else{
        var ret = {
            grand: 0
        }
        return ret
    }
}

//////////////////////////////////////////////////////////////////
const awardCollection = "awardInfo"
async function allocAwardFor(openId, grand){
    var awardKey = "prize_" + grand
    logger.info("alloc awardInfo for", awardKey)
    var aql = `for doc in ${awardCollection}
                filter doc._key=='${awardKey}' and doc.remainNum >= 1
                UPDATE doc with{
                remainNum: doc.remainNum-1,
                prizeUsers : APPEND(doc.prizeUsers, {openId: '${openId}', date: DATE_ISO8601(DATE_NOW())})
                } in ${awardCollection}
                LET previous = OLD 
                RETURN previous._key`

    var ret = await arangoDb.querySingleDoc(aql)
    return ret != null
}

//////////////////////////////////////////////////////////////////
async function addPrizeConnectWay(openId, grand, phone){
    var doc = {}
    doc.openId = openId
    doc.grand = grand
    doc.phone = phone 
    doc.time = getlocalTimeString()
    var ret = await arangoDb.saveDoc(doc)
    return ret
}

module.exports={
    startIntegral,
    stopIntegral,
    textChatStat,
    eventChatStat,
    notifyUnLoginUsers,
    queryUserIntegral,
    addNewDictationStat,
    addPrizeConnectWay,
    doLuckyDraw
}