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
        const file = fs.createWriteStream(savePath);
        file.on('finish', () => {
            file.close( ()=> {
                resolve();
            });
        });
        request({
            url: url,
            method: "POST",
            json: {
                scene: scene,
                is_hyaline: true,
                page : 'pages/surveyChat/main'
                // path : 'pages/surveyChat/main?id=' + scene
            }
        })
        .on('error', function(err) {
            logger.error('download qrcode from wechat error: ' + err)
            reject(err)
        })        
        .pipe(file);   
    });
}

async function getProfileQrCodeImage(url, surveyId) {
    const originalQrcodeImageName = surveyId + '_qrcode' + '.png';
    const targetQrcodeImageName = surveyId + '.png';
    const originalQrCodeImagePath = path.join('static/image', originalQrcodeImageName);
    const targetQrCodeImagePath = path.join('static/image', surveyId + '.png');

    if (!fs.existsSync(targetQrCodeImagePath)) {
        if (!fs.existsSync(originalQrCodeImagePath)) {
            await getQrCodeImageFromWechat(originalQrCodeImagePath, url, surveyId);
        }
        const survey = await Survey.getSurveyById(surveyId);
        const profileImageName = uuid.v1() + '.png';
        await download(path.join('static/image', profileImageName), survey.avatarUrl)
        await qrcode.draw(targetQrcodeImageName, originalQrcodeImageName, profileImageName, survey.title)
    }
    return targetQrcodeImageName
}

async function getQrCodeImage(url, surveyId) {
    const targetQrCodeImagePath = path.join('static/image', surveyId + '.png');

    if (!fs.existsSync(targetQrCodeImagePath)) {
        await getQrCodeImageFromWechat(targetQrCodeImagePath, url, surveyId);
    }
    return targetQrcodeImageName    
}

async function getQrCode(ctx) {
    try {
        const tocken = await accessTocken.getTocken();
        const url = 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + tocken;

        // const image = await getProfileQrCodeImage(url, ctx.query.scene)
        const image = await getQrCodeImage(url, ctx.query.scene)
        ctx.response.type = "application/json";
        ctx.response.body = {url : '/image?name=' + image};
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