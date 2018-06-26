const axios = require('axios');
const user = require('../models/user');
const config = require('../config');
const logger = require('../utils/logger').logger('userInfo');

const getUserId = async (ctx) => {
    try {
        const result = await axios.get('https://api.weixin.qq.com/sns/jscode2session',
            {
                params: {
                    appid: config.appid,
                    secret: config.secret,
                    js_code: ctx.query.code,
                    grant_type: 'authorization_code'
                }
            }
        );
    
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = result.data;
    } catch(err) {
        ctx.response.status = 404;
        logger.error('get openid error: ' + err);
    }
}

const getUserInfo = async (ctx) => {
    try {
        const info = await user.getInfo(ctx.query.userId);
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = info;
    } catch(err) {
        ctx.response.status = 404;
        logger.error('get user info error: ' + err);
    }
}

const updateWechatInfo = async (ctx) => {
    try {
        await user.updateWechatInfo(ctx.request.body.userId, ctx.request.body.wechatInfo);
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {result : 'success'};
    } catch(err) {
        ctx.response.status = 404;
        ctx.response.body = {result : 'failed'};
        logger.error('get user info error: ' + err);
    }
}

const updateAsstBotNickName = async (ctx) => {
    try {
        await user.updateAsstBotNickName(ctx.request.body.userId, ctx.request.body.nickname);
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {result : 'success'};
    } catch(err) {
        ctx.response.status = 404;
        ctx.response.body = {result : 'failed'};
        logger.error('update user asstbot nickname error: ' + err);
    }
}

const updateAsstBotGender = async (ctx) => {
    try {
        await user.updateAsstBotGender(ctx.request.body.userId, ctx.request.body.gender);
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {result : 'success'};
    } catch(err) {
        ctx.response.status = 404;
        ctx.response.body = {result : 'failed'};
        logger.error('update user asstbot gender error: ' + err);
    }
}

const updateAsstBotAvatarUrl = async (ctx) => {
    try {
        await user.updateAsstBotAvatarUrl(ctx.request.body.userId, ctx.request.body.avatarUrl);
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {result : 'success'};
    } catch(err) {
        ctx.response.status = 404;
        ctx.response.body = {result : 'failed'};
        logger.error('update user asstbot avatar url error: ' + err);
    }
}

const updateAsstBotMasterTitle = async (ctx) => {
    try {
        await user.updateAsstBotMasterTitle(ctx.request.body.userId, ctx.request.body.masterTitle);
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {result : 'success'};
    } catch(err) {
        ctx.response.status = 404;
        ctx.response.body = {result : 'failed'};
        logger.error('update user asstbot master title error: ' + err);
    }
}

module.exports = {
    'GET /openid' : getUserId,
    'GET /user'   : getUserInfo,
    'POST /user/wechat' : updateWechatInfo,
    'POST /user/asstBot/nickname' : updateAsstBotNickName,
    'POST /user/asstBot/gender' : updateAsstBotGender,
    'POST /user/asstBot/avatar' : updateAsstBotAvatarUrl,
    'POST /user/asstBot/master' : updateAsstBotMasterTitle
};