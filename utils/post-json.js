const request = require('request');

module.exports = (uri, data) => {
    return new Promise( (resolve, reject) => { 
        request( { method : 'POST'
                 , uri : uri
                 , json : data
                 }, (err, res, body) => {
                    if (!err && res.statusCode == 200) {
                        resolve(body);
                      } else {
                        reject(err);
                      }
                 }
            )
        } 
    );
}