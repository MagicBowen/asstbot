const axios = require('axios');
const config = require('../config.json');
const logger = require('../utils/logger').logger('userInfo');

const getUserId = async (ctx) => {
    try {
        var result = await axios.get('https://api.weixin.qq.com/sns/jscode2session',
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

module.exports = {
    'GET /openid' : getUserId
};