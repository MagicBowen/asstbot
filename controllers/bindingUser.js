var arangoDb = require("../models/arango.js")
const logger = require('../utils/logger').logger('bindingUser');


//////////////////////////////////////////////////////////////////
const bindingUser = async (ctx) => {
    try {
        const state = await arangoDb.bindingUser(ctx.request.body.openId, ctx.request.body.bindingCode, ctx.request.body.type, ctx.request.body.skill);
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
const unbindingUser = async (ctx) => {
    try {
        const state = await arangoDb.unBindingUser(ctx.request.body.openId, ctx.request.body.type, ctx.request.body.skill);
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

//////////////////////////////////////////////////////////////////
const getBindingPlat = async(ctx) => {
    try {
        const bindingUserType = await arangoDb.getBindingPlat(ctx.request.query.openId);
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {result : 'success', bindingTypes : bindingUserType};
    } catch(err) {
        ctx.response.status = 404;
        ctx.response.body = {result : 'failed', cause : err.toString()};
        logger.error(`add survey result error: ` + err.stack);
    }
}

//////////////////////////////////////////////////////////////////
const getBindingCode = async(ctx) => {
    try {
        const bindingCode = await arangoDb.getBindingCodeFor(ctx.request.body.userId, ctx.request.body.platform, ctx.request.body.skill);
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {result : 'success', code : bindingCode};
    } catch(err) {
        ctx.response.status = 404;
        ctx.response.body = {result : 'failed', cause : err.toString()};
        logger.error(`add survey result error: ` + err.stack);
    }
}

module.exports = {
    'GET /binding'  : getBindingUserType,
    'GET /bindingPlat'  : getBindingPlat,
    'POST /bindingCode' : getBindingCode,
    'POST /binding' : bindingUser,
    'POST /unbinding' : unbindingUser
};
