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

function getYesterdayDateString(){
    var myDate = new Date()
    myDate.setDate(myDate.getDate() - 1);
    return myDate.toLocaleDateString()
}

//////////////////////////////////////////////////////////////////
function getTimeStamp(){
    var date = new Date()
    return parseInt(date.getTime() / 1000)
}

const ONE_DAY = 1000*60*60*24

//////////////////////////////////////////////////////////////////
function getYestodayDateString(){
    var date = new Date()
    date.setTime(date.getTime() - ONE_DAY)
    return date.toLocaleDateString()
}

//////////////////////////////////////////////////////////////////
function getDateSixDayBefore(){
    var date = new Date()
    date.setTime(date.getTime() - 6 * ONE_DAY)
    return date.toLocaleDateString()
}

//////////////////////////////////////////////////////////////////
async function buildDoc(darwinId){
    var totalScore = 0
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
    doc.luckyDraw = []
    doc.shareEvent = []
    doc.state = "active"
    doc.totalScore = totalScore
    doc.usedScore = 0
    return doc
}

//////////////////////////////////////////////////////////////////
async function startIntegral(openId){
    var queryAql = `for doc in ${integralCollection}  filter doc._key == '${openId}' return doc`
    var doc = await arangoDb.querySingleDoc(queryAql)
    if(doc == null){
        var userIntegral = await buildDoc(openId)
        logger.info("user integral ", userIntegral)
        await arangoDb.saveDoc(integralCollection, userIntegral)
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
        var userIntegral = await buildDoc(openId)
        logger.info("user integral ", userIntegral)
        await arangoDb.saveDoc(integralCollection, userIntegral)
    }
    return true
}

//////////////////////////////////////////////////////////////////
var _event_score_rule={
    "login": [
        { start: 1,
          end: 6,
          score:  10},
        { start: 7,
          end: 20,
          score:  20},
        { start: 21,
          end: 100000,
          score:  30}
    ],
    "dictation": [
        { start: 1,
          end: 100000,
          score:  20}
    ],
    "luckyDraw" : [
        { start: 1,
           end: 100000,
           score:  100}
    ],
    "shareEvent" : [
        { start: 1,
            end: 100000,
            score:  10}
    ]
}

//////////////////////////////////////////////////////////////////
function clacAddScore(event, lastDay){
    if(event in  _event_score_rule){
        var matchRules = _event_score_rule[event].filter(rule =>{
            return rule.start <= lastDay && rule.end >= lastDay
        })
        if(matchRules.length == 0){
            return 10
        }
        return matchRules[0].score
    }
    return 0
}

//////////////////////////////////////////////////////////////////
function buildLastEventItem(event, lastDay, eventInfo){
    var doc = {}
    doc.day = getlocalDateString()
    doc.time = getlocalTimeString()
    doc.name = event
    doc.lastDay = lastDay
    Object.assign(doc, eventInfo)
    return JSON.stringify(doc)
}

//////////////////////////////////////////////////////////////////
async function doUpdateIntegal(event, openId, lastDay, eventInfo){
    var addScore = clacAddScore(event, lastDay)
    var lastEventItem = buildLastEventItem(event, lastDay,eventInfo)
    var updateAql = `LET doc = DOCUMENT("${integralCollection}/${openId}")
                    update doc with {
                        ${event}: APPEND(doc.${event}, ${lastEventItem}),
                        totalScore: doc.totalScore + ${addScore}
                    } in ${integralCollection}`
    return await arangoDb.updateDoc(updateAql)
}

//////////////////////////////////////////////////////////////////
async function addDayStat(event, openId){
    var today = getlocalDateString()
    var queryAql = `for doc in ${integralCollection} 
    filter doc._key == '${openId}'
    return LAST(doc.${event})`
    var doc = await arangoDb.querySingleDoc(queryAql)
    if(doc == null){
        return await doUpdateIntegal(event, openId, 1, {})
    }
    if(doc.day == today){
        return true
    }
    if(doc.day == getYesterdayDateString()) {
        return await doUpdateIntegal(event, openId, doc.lastDay + 1, {})
    }
    return await doUpdateIntegal(event, openId, 1, {})
}

//////////////////////////////////////////////////////////////////
async function statByResponse(userId, response){
    var ret = response.msgs.filter(msg => {
        return msg.type == "redirect" && msg.url == "dictation"
    })
    if (ret.length > 0){
        await addDayStat("dictation", userId)
    }
}

//////////////////////////////////////////////////////////////////
async function addNewDictationStat(userId){
    await addDayStat("dictation", userId)
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
        await addDayStat("login", userId)
        return true
    }
    // await statByResponse(request.session, response)
    return true
}

//////////////////////////////////////////////////////////////////
async function getUserIntegralDoc(openId){
    var queryAql = `for doc in ${integralCollection} 
    filter doc._key == '${openId}'
    return doc`
    return await arangoDb.querySingleDoc(queryAql)    
}

//////////////////////////////////////////////////////////////////
function buildNotifyMsg(openId){
    var body = {
        "templateId": "KS5Q1MoVjvleCKr_Ajf05xi25-G0t0dDIk4p5EDWyc0",
        "openId": openId,
        "data": {
            "keyword1": { "value": "打卡换积分抽奖活动" },
            "keyword2": { "value": "连续登录可以快速累积积分参与抽奖，现在登录看看你积分吧。" }
        }
    }
    return body
}

//////////////////////////////////////////////////////////////////
async function sendAwardNotifyFor(openId){
    var body = buildNotifyMsg(openId)
    logger.info(`send notify url ${config.sendNotifyUrl} msg  ${JSON.stringify(body)} `)
    var ret = await postJson(config.sendNotifyUrl, body)
    logger.info(`receive response is ${JSON.stringify(ret)}`)
}

//////////////////////////////////////////////////////////////////
const luckyDrawScore = 200

function getScoreInfoFor(doc){
    if(doc == null){
        return {totalScore: 0, usedScore: 0, remainScore: 0, drawTimes:0}
    }
    var ret = {}
    ret.totalScore = doc.totalScore,
    ret.usedScore = doc.usedScore,
    ret.remainScore = doc.totalScore - doc.usedScore,
    ret.drawTimes = Math.floor((doc.totalScore - doc.usedScore)/luckyDrawScore)
    return ret
}


async function queryUserIntegral(openId){
    var doc = await getUserIntegralDoc(openId)
    return getScoreInfoFor(doc)
}

//////////////////////////////////////////////////////////////////
function getloginLastDay(doc){
    if(doc == null || !doc.login){
        return 1
    }
    if(doc.login.length == 0){
        return 1
    }
    return doc.login[doc.login.length-1].lastDay
}

function getShareTimes(doc){
    if(doc == null || !doc.shareEvent){
        return 1
    }
    var today = getlocalDateString()
    var shareTodays = doc.shareEvent.filter( event => {
        return event.day == today
    })
    return shareTodays.length
}

//////////////////////////////////////////////////////////////////
async function queryUserIntegralDetail(openId){
    var doc = await getUserIntegralDoc(openId)
    var ret = {}
    ret.loginLastDay = getloginLastDay(doc)
    ret.shareTimesToday = getShareTimes(doc)
    Object.assign(ret, getScoreInfoFor(doc))
    return ret
}

//////////////////////////////////////////////////////////////////
async function  notifyUnLoginUsers(notifyEvent, count){
    var yestoday = getYestodayDateString()
    var today = getlocalDateString()
    var sixDayBefore = getDateSixDayBefore()
    var queryAql = `for doc in ${integralCollection} 
    let lastLogin = LAST(doc.login)
    filter lastLogin.day == '${yestoday}' or lastLogin.day == '${sixDayBefore}'
    filter doc.notifyDay != '${today}'
    limit ${count}
    update doc with {
        notifyDay: '${today}'
    } in ${integralCollection}
    return doc._key`
    return await arangoDb.queryDocs(queryAql)
}

//////////////////////////////////////////////////////////////////
async function getNotifyUserFor(notifyEvent, count){
    var aql = `for FormId in wechatFormId
    filter FormId.notifyEvent != '${notifyEvent}'
    limit ${count}
    update FormId with{
        notifyEvent:'${notifyEvent}'
    } in wechatFormId
    return FormId.openId`
    return await arangoDb.queryDocs(aql)
} 

//////////////////////////////////////////////////////////////////
async function notifyAwardLuckyDraw(){
    var openIds = await notifyUnLoginUsers('awardNotify', 20)
    if(openIds.length == 0){
        logger.info('all user is notified ....')
        return
    }
    openIds.forEach(openId => {
        logger.info('notify to openId', openId)
        sendAwardNotifyFor(openId)
    })
}

//////////////////////////////////////////////////////////////////
async function deductIntegral(openId){
    var aql =  `for doc in ${integralCollection}
                filter doc._key=='${openId}' and (doc.totalScore - doc.usedScore) >= ${luckyDrawScore}
                UPDATE doc with{
                usedScore: doc.usedScore+${luckyDrawScore}
                } in ${integralCollection}
                LET previous = OLD 
                RETURN previous._key`

    var ret = await arangoDb.querySingleDoc(aql)
    return ret != null
}

async function awardInegral(openId){
    return await doUpdateIntegal("luckyDraw", openId, 1, {})
}

//////////////////////////////////////////////////////////////////
function calcDrawGrand(){
    var luckyNum = Math.floor(Math.random()*1000)
    logger.info("lucky num ",luckyNum)
    if(luckyNum > 200 && luckyNum <= 210){
        return 1
    }
    if(luckyNum > 300 && luckyNum <= 350){
        return 2
    }
    if(luckyNum > 400 && luckyNum <= 450){
        return 0
    }
    return 3
}

//////////////////////////////////////////////////////////////////
async function doLuckyDraw(openId){
    var deductFlag = await deductIntegral(openId)
    if(deductFlag){
        var ret = {}
        var grand = calcDrawGrand()
        var flag = await allocAwardFor(openId, grand)
        if(flag){
            ret.grand = grand
            if(grand == 3){
                await awardInegral(openId)
            }
            return ret
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

const userAwardCollection = "userAwardInfo"

async function queryAwardInfoBy(grand){
    var awardKey = "prize_" + grand
    var aql = `for doc in ${awardCollection}
               filter doc._key=='${awardKey}'
               return doc.awardDesc` 
    return await arangoDb.querySingleDoc(aql)
}

//////////////////////////////////////////////////////////////////
async function addPrizeConnectWay(openId, grand, phone){
    var award = await queryAwardInfoBy(grand)
    var doc = {}
    doc.openId = openId
    doc.grand = grand
    if(award){
        doc.awardDesc = award
    }
    doc.phone = phone 
    doc.time = getlocalTimeString()
    var ret = await arangoDb.saveDoc(userAwardCollection, doc)
    return ret
}

//////////////////////////////////////////////////////////////////
async function queryUserAwards(openId){
    var aql = `for doc in ${userAwardCollection}
               filter doc.openId=='${openId}'
               return doc` 
    var ret = await arangoDb.queryDocs(aql)

    return ret.map( item => {
        var baseInfo = {}
        baseInfo.grand = item.grand
        baseInfo.awardDesc = item.awardDesc
        baseInfo.time = item.time
        return baseInfo
    })
}

//////////////////////////////////////////////////////////////////
async function addShareStat(sourceId, destId, scene){
    if(sourceId == destId){
        return true
    }
    var queryAql = `for doc in ${integralCollection} 
    filter doc._key == '${sourceId}'
    return doc.shareEvent`
    var doc = await arangoDb.queryDocs(queryAql)
    var sameEvents = doc.filter(event => {
        return event.destId == destId && event.scene == scene
    })
    if(sameEvents.length == 0){
        return await doUpdateIntegal("shareEvent", sourceId, 1, {destId, scene})
    }
    return true
}

const loginScenceCollection = "userLoginScene"

//////////////////////////////////////////////////////////////////
async function loginScene(body){
    var scene = body.scene
    var query = body.query
    logger.info("loginScene is ", body)
    body.time = getlocalTimeString()
    await arangoDb.saveDoc(loginScenceCollection, body)
    if(scene == 1007 || scene == 1008){
        if(query.from && body.user){
            await addShareStat(query.from, body.user, query.scene)
        }
    }
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
    doLuckyDraw,
    addShareStat,
    queryUserAwards,
    loginScene,
    notifyAwardLuckyDraw,
    sendAwardNotifyFor,
    queryUserIntegralDetail
}