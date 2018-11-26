const logger = require('../utils/logger').logger('tts');
const uuid = require('node-uuid');
const fs = require('fs');
const path = require('path');
const config = require('../config')
const AipSpeech = require("baidu-aip-sdk").speech;

function getTtsAudioFile(text, speed, role, pit, vol, audioPath) {
    speed = speed ? speed : 5
    role = role ? role : 4
    pit = pit ? pit : 5
    vol = vol ? vol : 5
    audioPath = audioPath ? audioPath : 'static/tts/'
    const client = new AipSpeech(config.baidu_api_id, config.baidu_api_key, config.baidu_secret_key)
    return new Promise( (resolve, reject) => {
        client.text2audio(text, {spd: speed, per: role, pit: pit, vol: vol}).then(function(result) {
            if (result.data) {
                const filename = uuid.v1() + '.wav'
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

// const text = "从前有座山，山上有座庙，庙里有个老和尚，再给小和尚讲故事。他说：“从前有座山，山里有座庙，庙里有个老和尚，再给小和尚讲故事。”"
// getTtsAudioFile(text, 5, 1, 5, 5, '../static/tts/')
