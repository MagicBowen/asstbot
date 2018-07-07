const Canvas = require('canvas')
const Image = Canvas.Image
const fs = require('fs');
const path = require('path');

function drawImage() {
    const canvasWidth = 430
    const canvasHeight = 600
    const qrCodeWidth = 430
    const qrScale = 0.9
    const qrcodeTargetWidth = qrCodeWidth * qrScale
    const heightMargin = (canvasHeight - qrcodeTargetWidth)/2
    const profileTargetWidth = (qrcodeTargetWidth)/2.2
    const portraitPath = path.join(__dirname, '../static/image/test-profile.png')
    const qrcodePath = path.join(__dirname, '../static/image/test-qrcode.png')

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
    
    // mask profile in qrcode
    ctx.beginPath()
    ctx.fillStyle = '#eeeeee'
    ctx.arc(canvasWidth/2, canvasHeight/2, profileTargetWidth/2, 0, Math.PI * 2, true)
    ctx.fill()
    ctx.save()

    // draw new profile
    let profileImg = new Image()
    profileImg.src = fs.readFileSync(portraitPath)

    ctx.drawImage(profileImg, 
        (canvasWidth - profileTargetWidth) /2,
        (canvasHeight - profileTargetWidth)/2, 
        profileTargetWidth, 
        profileTargetWidth)

    // add title
    ctx.font = `bold ${0.04 * canvasWidth}px pfennigFont`
    ctx.fillStyle = '#000'
    ctx.textAlign = 'center'
    ctx.fillText('长按二维码，参与尉总发起的问卷吧', canvasWidth / 2, heightMargin / 2)

    // add footer
    ctx.font = `bold ${0.06 * canvasWidth}px pfennigFont`
    ctx.fillStyle = '#000'
    ctx.textAlign = 'center'
    ctx.fillText('快来看看你有多了解我！', canvasWidth / 2, (canvasHeight +  qrcodeTargetWidth + heightMargin) / 2)

    let out = fs.createWriteStream(__dirname + '/test.png')
    , stream = canvas.createPNGStream();
  
    stream.on('data', function(chunk){
        out.write(chunk);  
    })  
}

drawImage();