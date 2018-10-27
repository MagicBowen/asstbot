var arangoDb = require("../models/arango.js")
const logger = require('../utils/logger').logger('dictateWords');

//////////////////////////////////////////////////////////////////
const addDictateWords = async (ctx) => {
    try {
        const id = await arangoDb.addDictateWords(ctx.request.body.openId, ctx.request.body.dictateWords);
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {result : 'success', id : id};
    } catch(err) {
        ctx.response.status = 404;
        ctx.response.body = {result : 'failed', cause : err.toString()};
        logger.error(`add survey result error: ` + err.stack);
    }
};


//////////////////////////////////////////////////////////////////
const udpateDictateWords = async(ctx) => {
    try {
        const id = await arangoDb.udpateDictateWords(ctx.request.body.id, ctx.request.body.dictateWords);
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {result : 'success', id : id};
    } catch(err) {
        ctx.response.status = 404;
        ctx.response.body = {result : 'failed', cause : err.toString()};
        logger.error(`add survey result error: ` + err.stack);
    }
}

//////////////////////////////////////////////////////////////////
const deleteDictateWords = async(ctx) => {
    try {
        const id = await arangoDb.deleteDictateWords(ctx.request.query.id);
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {result : 'success', id : id};
    } catch(err) {
        ctx.response.status = 404;
        ctx.response.body = {result : 'failed', cause : err.toString()};
        logger.error(`add survey result error: ` + err.stack);
    }
}

const getAllDictateWords = async(ctx) => {
    try {
        const wordsList = await arangoDb.getAllDictateWords(ctx.request.query.openId);
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {result : 'success', data : wordsList};
    } catch(err) {
        ctx.response.status = 404;
        ctx.response.body = {result : 'failed', cause : err.toString()};
        logger.error(`add survey result error: ` + err.stack);
    }
}



module.exports = {
    'GET /dictateWords'  : getAllDictateWords,
    'POST /dictateWords' : addDictateWords,
    'PUT /dictateWords'  : udpateDictateWords,
    'DELETE /dictateWords'  : deleteDictateWords
};
