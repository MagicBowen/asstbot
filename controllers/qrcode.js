const accessTocken = require('../utils/access-tocken');
const postJson = require('../utils/postjson');
const fs = require('fs');
const path = require('path');
const uuid = require('node-uuid');
const logger = require('../utils/logger').logger('controller_qrcode');

async function getQrCode(ctx) {
    try {
        // const tocken = await accessTocken.getTocken();
        const tocken = '11_cBcYlJZQpRTe_iZ7oPGA1b2jUGrDTxAnJJ9uzTuerq-PAe-sCwYPnGUwAbDoQU8dHmSdTNbMUVkZEAQGFkk4ZETLIsw7f6HobYFQL7xPvaUqi336eIu3vua-OXEQNSbABAHEJ';
        const tocken = '11_cBcYlJZQpRTe_iZ7oPGA1b2jUGrDTxAnJJ9uzTuerq-PAe-sCwYPnGUwAbDoQU8dHmSdTNbMUVkZEAQGFkk4ZETLIsw7f6HobYFQL7xPvaUqi336eIu3vua-OXEQNSbABAHEJ';
        const url_a = 'https://api.weixin.qq.com/wxa/getwxacode?access_token=';
        const url_b = 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=';
        const result = await postJson(url_a + tocken,
            {
                // scene : ctx.query.scene,
                // page : 'pages/home/main'
                path : 'pages/home/main'
            });
        console.log(JSON.stringify(result));
        const filename = uuid.v1() + '.jpg';
        fs.writeFileSync('static/image/' + filename, result);
        ctx.response.type = "application/json";
        ctx.response.body = {url : "/image?name="+filename};
        ctx.response.status = 200;
    } catch(err) {
        ctx.response.status = 404;
        logger.error('get qrcode failed: ' + err);
    }
}

module.exports = {
    'GET /qrcode' : getQrCode
}