const fs = require('fs');
const request = require('request');

function download(filepath, url) {
    return new Promise( (resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        file.on('finish', () => {
            file.close( ()=> {
                resolve();
            });
        });
        request.get(url)
        .on('error', function(err) {
            reject(err)
        })        
        .pipe(file);
    })
}

module.exports = download;
