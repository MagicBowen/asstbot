const logger = require('../utils/logger').logger('userIntegral');
var  integral = require("../models/integral.js")

const getUserIntegral = async (ctx) => {
    try {
        var ret = await integral.queryUserIntegral(ctx.request.query.id)
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {result : 'success', data: ret};
    } catch(err) {
        ctx.response.status = 404;
        ctx.response.body = {result : 'failed'};
        logger.error(`getUserIntegral error: ` + err.stack);
    }    
};

const doLuckyDraw = async(ctx) => {
    try {
        var ret = await integral.doLuckyDraw(ctx.request.body.id)
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {result : 'success', data: ret};
    } catch(err) {
        ctx.response.status = 404;
        ctx.response.body = {result : 'failed'};
        logger.error(`doLuckyDraw error: ` + err.stack);
    }
}

const savePrizeUser = async(ctx) => {
    try {
        var ret = await integral.addPrizeConnectWay(ctx.request.body.id, ctx.request.body.grand, ctx.request.body.phone)
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {result : 'success', data: ret};
    } catch(err) {
        ctx.response.status = 404;
        ctx.response.body = {result : 'failed'};
        logger.error(`doLuckyDraw error: ` + err.stack);
    }
}

const addShareEvent = async(ctx) => {
    try {
        var ret = await integral.addShareStat(ctx.request.body.sourceId, ctx.request.body.destId, ctx.request.body.type)
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {result : 'success', data: ret};
    } catch(err) {
        ctx.response.status = 404;
        ctx.response.body = {result : 'failed'};
        logger.error(`doLuckyDraw error: ` + err.stack);
    }
}

module.exports = {
    'GET /integral'    :  getUserIntegral,
    'POST /lukydraw'   :  doLuckyDraw,
    'POST /prizeuser'  :  savePrizeUser,
    'POST /shareEvent' :  addShareEvent
};