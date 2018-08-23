const logger = require('../utils/logger').logger('mongo-simplifier');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.model('Simplifiers', new Schema({
    userId : { type: String, required: true},
    query  : { type: String, required: true},
    result : { type: String, required: true},
    correct : String,
    mark : String   // phrase | wrong | modify | omit
}, { timestamps: { createdAt: 'created_at' } }));

const Simplifier = mongoose.model('Simplifiers');

const model = {};

model.addResult = async (userId, query, result, mark, modified) => {
    logger.debug(`add simplifier result for user ${userId}`);
    let data = {
        userId  : userId,
        query   : query,
        result  : result,
        mark    : mark
    }
    if (modified) {
        data.correct = modified
    }
    const simplifier = new Simplifier(data);
    await simplifier.save();
    logger.debug(`add new simplifier result ${JSON.stringify(data)} successful!`);    
};

module.exports = model;