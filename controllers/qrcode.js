const accessTocken = require('../utils/access-tocken');
const request = require('request');
const fs = require('fs');
const uuid = require('node-uuid');
const logger = require('../utils/logger').logger('controller_qrcode');

async function getQrCode(ctx) {
    try {
        // const tocken = await accessTocken.getTocken();
        const tocken = '11__a6XqIN_zezhS4RK-13c-iIO2FRN-cg4hEqU_f49_kyDxro0kiFAYfBy-9lf2Dm-CDm2JdLSfmj_gLV8Y1LV2ry_Q_jCWTXk_KcPFQmDUdah04udp4RtGx-a7V2rH10cXOS6FnPlB30pgtBJDXJbAAAHBN';
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
                path : 'pages/index/main?id=' + ctx.query.scene
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