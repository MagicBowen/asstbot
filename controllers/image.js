const path = require('path')
const fs = require('fs')
const logger = require('../utils/logger').logger('image');
const uuid = require('node-uuid');
const images = require("images");

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
        let quality = ctx.query.quality;
        if (quality) {
            let compressFileName = imageFileName.split('.')[0] + `_c_${quality}` + path.extname(imageFileName)
            images(path.join('static/image', imageFileName)).save(path.join('static/image', compressFileName), { quality : quality })
            ctx.response.body = {fileUrl : 'image/' + compressFileName, message:'compress image success'};
            logger.debug(`upload to compress image : ${compressFileName}`);
        }
        else {
            ctx.response.body = {fileUrl : 'image/' + imageFileName, message:'upload image success'};
            logger.debug(`upload image : ${imageFileName}`);
        }
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
