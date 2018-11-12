const arangoDb = require("./arangoDb.js")
var db = arangoDb.getDb() 
const logger = require('../utils/logger').logger('integral');

async function addIntegal(openId){
    var darwinId = await arangoDb.getDarwinId(openId)


}

module.exports={
    addIntegal
}