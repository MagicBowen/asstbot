const logger = require('../utils/logger').logger('controller-media');
const uuid = require('node-uuid');
const fs = require('fs');

function saveFile(file, path) {
    return new Promise( (resolve, reject) => {
        const reader = fs.createReadStream(file.path);
        const ext = file.name.split('.').pop();
        if (ext != 'mp3' && ext != 'mp4') {
            throw reject('not support file type : ' + ext);
        }
        const fileName = `${uuid.v1()}.${ext}`;
        const filePath = `${path}/${fileName}`;
        const upStream = fs.createWriteStream(filePath);
        upStream.on('finish', () => {
            upStream.close( ()=> {
                resolve(fileName);
            });
        });
        reader.pipe(upStream);
    })
}

async function postAudio(ctx) {
    try {
        const mp3FileName = await saveFile(ctx.request.body.files.audio, 'static/audio');
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {url : '/audio/' + mp3FileName};
    } catch (err) {
        ctx.response.status = 404;
        ctx.response.type = "application/json";
        ctx.response.body = {error: err.toString()};
        logger.error('post audio failed: ' + err);
    }
}

async function postVedio(ctx) {
    try {
        const filename = await saveFile(ctx.request.body.files.vedio, 'static/vedio');
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {url : '/vedio/' + filename};
    } catch (err) {
        ctx.response.status = 404;
        ctx.response.type = "application/json";
        ctx.response.body = {error: err.toString()};
        logger.error('post vedio failed: ' + err);
    }
}

module.exports = {
    'POST /audio' : postAudio,
    'POST /vedio' : postVedio
}
