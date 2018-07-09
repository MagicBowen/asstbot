const logger = require('../utils/logger').logger('controller-asr');
const uuid = require('node-uuid');
const fs = require('fs');

async function getAsrResult(ctx) {
    try {
        const audioFile = await ctx.request.body.files.audio;
        const reader = fs.createReadStream(audioFile.path);
        const ext = audioFile.name.split('.').pop();
        if (ext != 'mp3') {
            throw Error('not support file type : ' + ext);
        }
        const fileName = `${uuid.v1()}.${ext}`;
        const filePath = `static/audio/${fileName}`;
        const upStream = fs.createWriteStream(filePath);
        reader.pipe(upStream);
        ctx.response.type = "application/json";
        ctx.response.status = 200;
        ctx.response.body = {url : '/audio/' + fileName, text : 'asr result'};
    } catch (err) {
        ctx.response.status = 404;
        ctx.response.type = "application/json";
        ctx.response.body = {error: err.toString()};
        logger.error('asr handler failed: ' + err);
    }
}

module.exports = {
    'POST /asr' : getAsrResult
}