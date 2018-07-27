const path = require('path')
const fs = require('fs')
const logger = require('../utils/logger').logger('image');
const uuid = require('node-uuid');
const ImageUtil = require('../utils/image');

async function fillImageToCtx(ctx, image) {
    logger.debug("get image file is:" + image)
    if (fs.existsSync(image)) {
        ctx.response.type = "image/jpg";
        ctx.response.body = fs.readFileSync(image);
    } else {
        logger.warn("file is un exsited")
        ctx.response.status = 404;
    }
}

var getImage = async (ctx, next) => {
    var name = ctx.query.name;
    var image = `static/image/${name}`;
    await fillImageToCtx(ctx, image);
};

function saveFile(file, path) {
    return new Promise( (resolve, reject) => {
        const reader = fs.createReadStream(file.path);
        const ext = file.name.split('.').pop();   
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

async function addImageFile(ctx) {
    try {
        let imageFileName = await saveFile(ctx.request.body.files.image, 'static/image');
        const ext = imageFileName.split('.').pop();
        let compress = ctx.query.compress;
        if (compress && ext !== 'gif') {
            ImageUtil.fitToPhone(imageFileName, 'static/image')
            logger.debug(`upload image ${imageFileName} has been compressed!`);
        }
        ctx.response.body = {fileUrl : 'image/' + imageFileName, message:'upload image success'};
        ctx.response.type = "application/json";
        ctx.response.status = 200;
    } catch (err) {
        ctx.response.status = 404;
        ctx.response.type = "application/json";
        ctx.response.body = {error: err.toString()};
        logger.error('upload image failed: ' + err);
        logger.debug(err.stack);
    }
}


module.exports = {
    'GET /image': getImage,
    'POST /image' : addImageFile
};
