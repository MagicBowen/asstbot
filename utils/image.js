const images = require('images');
const path = require('path');

function fitImageToPhone(imageFile, dir) {
    const phoneWidth = 750;
    const imagePath = path.join(dir, imageFile);
    const image = images(imagePath);
    const size = image.size();
    if (size.width > phoneWidth) {
        const quality = Math.floor((100 * phoneWidth)/size.width);
        image.size(phoneWidth).save(imagePath, {quality : quality});
        console.log(JSON.stringify(size))
        console.log(quality)
    }
}

module.exports.fitToPhone = fitImageToPhone