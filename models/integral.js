const arangoDb = require("./arangoDb.js")
var db = arangoDb.getDb() 
const logger = require('../utils/logger').logger('integral');

const integralCollection = "userIntegral"

async function addIntegal(openId){
    var darwinId = await arangoDb.getDarwinId(openId)
    var aql = `for doc in ${integralCollection}  filter doc._key == '${darwinId}' return doc`
    var doc = await arangoDb.querySingleDoc(aql)
    if(doc == null){
        
    }


}

module.exports={
    addIntegal
}