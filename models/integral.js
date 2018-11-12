const arangoDb = require("./arangoDb.js")
var db = arangoDb.getDb() 
const logger = require('../utils/logger').logger('integral');

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
    doc.state = "active"
    return doc
}

//////////////////////////////////////////////////////////////////
async function startIntegral(openId){
    var darwinId = await arangoDb.getDarwinId(openId)
    var queryAql = `for doc in ${integralCollection}  filter doc._key == '${darwinId}' return doc`
    var doc = await arangoDb.querySingleDoc(queryAql)
    if(doc == null){
        await arangoDb.saveDoc(integralCollection, buildDoc(darwinId))
    }
    var updateAql = `LET doc = DOCUMENT("${integralCollection}/${darwinId}")
    update doc with {
       state : 'active'
    } in ${integralCollection}`
    await arangoDb.updateDoc(updateAql)
    return true
}

//////////////////////////////////////////////////////////////////
async function stopIntegral(openId){
    var darwinId = await arangoDb.getDarwinId(openId)
    var updateAql = `LET doc = DOCUMENT("${integralCollection}/${darwinId}")
    update doc with {
       state : 'inActive'
    } in ${integralCollection}`
    return await arangoDb.updateDoc(updateAql)
}

//////////////////////////////////////////////////////////////////
function buildLoginStatItem(){
    var doc = {}
    doc.day = getlocalDateString()
    doc.timestamp = getTimeStamp()
    return JSON.stringify(doc)
}

//////////////////////////////////////////////////////////////////
async function userLoginStat(openId){
    var darwinId = await arangoDb.getDarwinId(openId)
    var updateAql = `for doc in ${integralCollection} 
                       filter doc._key == '${darwinId}' and doc.state == 'active'
                       update doc with {
                           login: APPEND(doc.login, ${buildLoginStatItem()})
                       } in ${integralCollection}`
    return await arangoDb.updateDoc(updateAql)
}

async function textChatStat(request, response){
    return
}

async function eventChatStat(request, response){
    var eventName = request.event.name
    var userId = request.session
    if(eventName == "login") {
        await userLoginStat(userId)
    }
    return true
}

module.exports={
    startIntegral,
    stopIntegral,
    userLoginStat,
    textChatStat,
    eventChatStat
}