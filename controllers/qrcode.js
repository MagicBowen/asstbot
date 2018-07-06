const accessTocken = require('../utils/access-tocken');
const postJson = require('../utils/postjson');
const logger = require('../utils/logger').logger('controller_qrcode');

async function getQrCode(ctx) {
    try {
        const tocken = await accessTocken.getTocken();
        const result = await postJson('https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + tocken,
            {
                scene : ctx.query.scene,
                page : ctx.query.page
            });
        
        ctx.response.type = "image/jpg";
        ctx.response.body = result;
        ctx.response.status = 200;
    } catch(err) {
        ctx.response.status = 404;
        logger.error('get qrcode failed: ' + err);
    }
}

module.exports = {
    'GET /qrcode' : getQrCode
}