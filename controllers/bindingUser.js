var arangoDb = require("../models/arango.js")
const logger = require('../utils/logger').logger('bindingUser');


//////////////////////////////////////////////////////////////////
const bindingUser = async (ctx) => {
    try {
        const state = await arangoDb.bindingUser(ctx.request.body.openId, ctx.request.body.bindingCode, ctx.request.body.voiceType);
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {result : 'success', state : state};
    } catch(err) {
        ctx.response.status = 404;
        ctx.response.body = {result : 'failed', cause : err.toString()};
        logger.error(`add survey result error: ` + err.stack);
    }
};


//////////////////////////////////////////////////////////////////
const getBindingUserType = async(ctx) => {
    try {
        const bindingUserType = await arangoDb.getBindingUserType(ctx.request.query.openId);
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {result : 'success', bindingTypes : bindingUserType};
    } catch(err) {
        ctx.response.status = 404;
        ctx.response.body = {result : 'failed', cause : err.toString()};
        logger.error(`add survey result error: ` + err.stack);
    }
}


module.exports = {
    'GET /binding'  : getBindingUserType,
    'POST /binding' : bindingUser
};
