const shell = require('shelljs')
const path = require("path")

function tmpLameOutFile (file) {
  return path.join(path.dirname(file), path.basename(file, '.mp3') + 'lame.wav')
}

function tmpSoundStretchOutFile (file) {
  return path.join(path.dirname(file), path.basename(file, '.mp3') + 'ss.wav')
}

function pitchShiftCommand(file) {
  let lameFile = tmpLameOutFile(file)
  let ssFile = tmpSoundStretchOutFile(file)
  return `lame --decode ${file} ${lameFile} && soundstretch ${lameFile} ${ssFile} -pitch=3 && lame ${ssFile} ${file}`
}

function pitchShitSync(file) {
  return shell.exec(pitchShiftCommand(file))
}

function pitchShiftAsync(file) {
  return new Promise((resolve, reject) => {
    shell.exec(pitchShiftCommand(file), 
      (code, stdout, stderr) => {
        if (code === 1) {
          resolve({code, stdout, stderr})
        } else {
          reject(stderr)
        }
      })
  })
}

module.exports = {
  pitchShitSync,
  pitchShiftAsync
}