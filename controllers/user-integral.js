const logger = require('../utils/logger').logger('userIntegral');
var  integral = require("../models/integral.js")

const getUserIntegral = async (ctx) => {
    try {
        var ret = await integral.getUserIntegral(ctx.request.query.id)
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {result : 'success', data: ret};
    } catch(err) {
        ctx.response.status = 404;
        ctx.response.body = {result : 'failed'};
        logger.error(`delete survey result error: ` + err.stack);
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
        logger.error(`delete survey result error: ` + err.stack);
    }
}

module.exports = {
    'GET /integral'  : getUserIntegral,
    'POST /lukydraw' :  doLuckyDraw
};