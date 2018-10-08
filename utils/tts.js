const logger = require('../utils/logger').logger('tts');
const uuid = require('node-uuid');
const fs = require('fs');
const path = require('path');
const config = require('../config')
const AipSpeech = require("baidu-aip-sdk").speech;

function getTtsAudioFile(text) {
    const client = new AipSpeech(config.baidu_api_id, config.baidu_api_key, config.baidu_secret_key)
    return new Promise( (resolve, reject) => {
        client.text2audio(text, {spd: 5, per: 4}).then(function(result) {
            if (result.data) {
                const audioFile = 'tts/' + uuid.v1() + '.mp3'
                fs.writeFileSync(audioFile, result.data)
                logger.debug('get tts audio from baidu: ' + audioFile)
                resolve(audioFile)
            } else {
                logger.error(result)
                reject(result)
            }
        }, function(e) {
            reject(e)
        });
    })
}

module.exports.getTts = getTtsAudioFile