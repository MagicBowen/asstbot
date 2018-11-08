const logger = require('../utils/logger').logger('tts');
const uuid = require('node-uuid');
const fs = require('fs');
const path = require('path');
const config = require('../config')
const AipSpeech = require("baidu-aip-sdk").speech;

function getTtsAudioFile(text, speed, role, audioPath) {
    speed = speed ? speed : 5
    role = role ? role : 4
    audioPath = audioPath ? audioPath : 'static/tts/'
    const client = new AipSpeech(config.baidu_api_id, config.baidu_api_key, config.baidu_secret_key)
    return new Promise( (resolve, reject) => {
        client.text2audio(text, {spd: speed, per: role}).then(function(result) {
            if (result.data) {
                const filename = uuid.v1() + '.mp3'
                const filepath = audioPath + filename
                fs.writeFileSync(filepath, result.data)
                logger.debug('get tts audio from baidu: ' + filepath)
                resolve(filename)
            } else {
                logger.error(result)
                reject(result)
            }
        }, function(e) {
            reject(e)
        });
    })
}

module.exports.getAudio = getTtsAudioFile

getTtsAudioFile('浪花', 1, 3, '../static/tts/')