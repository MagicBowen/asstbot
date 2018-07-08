const Canvas = require('canvas')
const Image = Canvas.Image
const fs = require('fs');
const path = require('path');

const relativeImagePath = '../static/image'

function saveCanvasToPngFile(canvas, filePath) {
    return new Promise( (resolve, reject) => {
        let out = fs.createWriteStream(filePath)    
        let stream = canvas.createPNGStream();
        stream.on('data', function(chunk){
            out.write(chunk);  
        });
        stream.on('end', function(){
            resolve();
        });        
    }); 
}

async function drawImage(targetFileName, qrcodeFileName, portraitFileName, title, nickname) {
    const canvasWidth = 430
    const canvasHeight = 430
    const qrCodeWidth = 430
    const qrScale = 1.0
    const qrcodeTargetWidth = qrCodeWidth * qrScale
    const heightMargin = (canvasHeight - qrcodeTargetWidth)/2
    const profileTargetWidth = (qrcodeTargetWidth)/2.2
    const portraitPath = path.join(__dirname, relativeImagePath, portraitFileName)
    const qrcodePath = path.join(__dirname, relativeImagePath, qrcodeFileName)

    // init canvas
    const canvas = new Canvas(canvasWidth, canvasHeight)
    const ctx = canvas.getContext('2d')

    // draw background
    ctx.fillStyle = '#FFF'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.save()

    // draw qrcode image
    let qrcodeImg = new Image()
    qrcodeImg.src = fs.readFileSync(qrcodePath)

    ctx.drawImage(qrcodeImg, 
        (canvasWidth - qrcodeTargetWidth)/2,
        (canvasHeight - qrcodeTargetWidth)/2, 
        qrcodeTargetWidth, 
        qrcodeTargetWidth)

    ctx.save()

    // draw circle profile to mask the original profile
    ctx.beginPath()
    ctx.arc(canvasWidth/2, canvasHeight/2, profileTargetWidth/2, 0, Math.PI * 2, true)
    ctx.clip()
    let profileImg = new Image()
    profileImg.src = fs.readFileSync(portraitPath)
    ctx.drawImage(profileImg, 
        0,
        0,
        profileTargetWidth, 
        profileTargetWidth)
    ctx.restore()
    
    // mask profile in qrcode
    // ctx.beginPath()
    // ctx.fillStyle = '#eeeeee'
    // ctx.arc(canvasWidth/2, canvasHeight/2, profileTargetWidth/2, 0, Math.PI * 2, true)
    // ctx.fill()
    // ctx.save()

    // draw new profile
    // let profileImg = new Image()
    // profileImg.src = fs.readFileSync(portraitPath)

    // ctx.drawImage(profileImg, 
    //     (canvasWidth - profileTargetWidth) /2,
    //     (canvasHeight - profileTargetWidth)/2, 
    //     profileTargetWidth, 
    //     profileTargetWidth)

    // // add title
    // ctx.font = `bold ${0.04 * canvasWidth}px pfennigFont`
    // ctx.fillStyle = '#000'
    // ctx.textAlign = 'center'
    // ctx.fillText(`长按二维码，参与${nickname}发起的问卷吧`, canvasWidth / 2, heightMargin / 2)

    // // add footer
    // ctx.font = `bold ${0.06 * canvasWidth}px pfennigFont`
    // ctx.fillStyle = '#000'
    // ctx.textAlign = 'center'
    // ctx.fillText(title, canvasWidth / 2, (canvasHeight +  qrcodeTargetWidth + heightMargin) / 2)

    // let out = fs.createWriteStream(path.join(__dirname, relativeImagePath, targetFileName))
    // let stream = canvas.createPNGStream();
    // stream.on('data', function(chunk){
    //     out.write(chunk);  
    // })
    await saveCanvasToPngFile(canvas, path.join(__dirname, relativeImagePath, targetFileName));
}

module.exports = { draw : drawImage };