const logger = require('../utils/logger').logger('model');
var mongoose = require('mongoose');
var arangoDb = require("./arango.js")

module.exports.init = async () => {
    mongoose.connect('mongodb://localhost:27017/asstbot');
    arangoDb.init()
    logger.info('Init mongo db model successful!');
}