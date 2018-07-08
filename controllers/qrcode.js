const accessTocken = require('../utils/access-tocken');
const request = require('request');
const fs = require('fs');
const path = require('path');
const Survey = require('../models/survey');
const qrcode = require('../utils/qrcode');
const download = require('../utils/download-file');
const uuid = require('node-uuid');
const logger = require('../utils/logger').logger('controller_qrcode');

function getQrCodeImageFromWechat(savePath, url, scene) {
    return new Promise( (resolve, reject) => {
        console.log('qr promise')
        const file = fs.createWriteStream(savePath);
        file.on('finish', () => {
            console.log('file finish')
            file.close( ()=> {
                console.log('file close')
                resolve();
            });
        });
        request({
            url: url,
            method: "POST",
            json: {
                // scene: scene,
                // page : 'pages/index/main'
                path : 'pages/index/main?id=' + scene
            }
        })
        .on('error', function(err) {
            console.log('request error')
            reject(err)
        })        
        .pipe(file);   
    });
}

async function getQrCode(ctx) {
    try {
        const tocken = await accessTocken.getTocken();
        // const tocken = '11_cDzPzj_5E98GQUIATlG6J0aQYraIJ56mAkoXek_04fZ0RJtFWoAXDPxfQ4Fb8yDg3s-O28EK5eFKD3_bhnoVfZdGjO-nvhM-fduzpi1r-yHn9u1sjC8IR5q0oI9QXQT-tSG_Bk-WY6MmRCgcVAIjAFAGLT';
        const url = 'https://api.weixin.qq.com/wxa/getwxacode?access_token=' + tocken;
        // const url = 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + tocken;

        const surveyId = ctx.query.scene;
        const originalQrcodeImageName = surveyId + '_qrcode' + '.png';
        const targetQrcodeImageName = surveyId + '.png';
        const originalQrCodeImagePath = path.join('static/image', originalQrcodeImageName);
        const targetQrCodeImagePath = path.join('static/image', surveyId + '.png');

        if (!fs.existsSync(targetQrCodeImagePath)) {
            if (!fs.existsSync(originalQrCodeImagePath)) {
                console.log('original qrcode image un existed')
                await getQrCodeImageFromWechat(originalQrCodeImagePath, url);
            }
            const survey = await Survey.getSurveyById(surveyId);
            const profileImageName = uuid.v1() + '.png';
            console.log('await download profile')
            await download(profileImageName, survey.avatarUrl)
            console.log('await to draw qrimage')
            await qrcode.draw(targetQrcodeImageName, originalQrcodeImageName, profileImageName, survey.title)
        }
        console.log('generate response');
        ctx.response.type = "application/json";
        ctx.response.body = {url : '/image?name=' + targetQrcodeImageName};
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