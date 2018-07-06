const accessTocken = require('../utils/access-tocken');
const request = require('request');
const fs = require('fs');
const uuid = require('node-uuid');
const logger = require('../utils/logger').logger('controller_qrcode');

async function getQrCode(ctx) {
    try {
        const tocken = await accessTocken.getTocken();
        const url = 'https://api.weixin.qq.com/wxa/getwxacode?access_token=' + tocken;
        // const url = 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + tocken;

        const filename = uuid.v1() + '.png';
        const filePath = 'static/image/' + filename;

        request({
            url: url,
            method: "POST",
            json: {
                // scene: ctx.query.scene,
                // page : 'pages/index/main'
                path : 'pages/index?id=' + ctx.query.scene
            }
        }).pipe(fs.createWriteStream(filePath));

        ctx.response.type = "application/json";
        ctx.response.body = {url : "/image?name="+filename};
        ctx.response.status = 200;
    } catch(err) {
        ctx.response.status = 404;
        logger.error('get qrcode failed: ' + err);
        logger.debug(err.stack);
    }
}

module.exports = {
    'GET /qrcode' : getQrCode
}