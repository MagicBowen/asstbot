const logger = require('../utils/logger').logger('model');
var mongoose = require('mongoose');
var arangoDb = require("./arangoDb.js")

module.exports.init = async () => {
    mongoose.connect('mongodb://localhost:27017/asstbot');
    arangoDb.getDb()
    logger.info('Init mongo db model successful!');
}