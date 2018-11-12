var arango = require('arangojs');
var config = require('../config.js')
const logger = require('../utils/logger').logger('arangodb');
var db = null 

function getDb(){
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

module.exports={
    getDb
}
