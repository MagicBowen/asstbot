const path = require('path')
const os = require('os')
const fs = require('fs')
const Busboy = require('busboy')
const static_picture_path = 'static/image'

async function fillImageToCtx(ctx, image) {
    console.log("get image file is:" + image)
    if (fs.existsSync(image)) {
        ctx.response.type = "image/jpg";
        ctx.response.body = fs.readFileSync(image);
    } else {
        console.log("file is un exsited")
        ctx.response.status = 404;
    }    
}

var getImage = async (ctx, next) => {
    var name = ctx.query.name;
    var image = `${static_picture_path}/${name}`;
    // var image = `image/${name}`;
    await fillImageToCtx(ctx, image);
};

function mkdirsSync( dirname ) {
  if (fs.existsSync( dirname )) {
    return true
  } else {
    if (mkdirsSync( path.dirname(dirname)) ) {
      fs.mkdirSync( dirname )
      return true
    }
  }
}

function getSuffixName( fileName ) {
  let nameList = fileName.split('.')
  return nameList[nameList.length - 1]
}

function uploadFile( ctx, filePath) {
  let req = ctx.req
  let res = ctx.res
  mkdirsSync( filePath )
  let busboy = new Busboy({headers: req.headers})
  return new Promise((resolve, reject) => {
    console.log('upload...')
    let result = { 
      success: false,
      formData: {},
    }

    busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
      console.log("fileName:" + filename)
      let fileName = Math.random().toString(16).substr(2) + '.' + getSuffixName(filename)
      let _uploadFilePath = path.join( filePath, fileName )
      let saveTo = path.join(_uploadFilePath)

      console.log("save file path:" + saveTo)

      file.pipe(fs.createWriteStream(saveTo))

      file.on('end', function() {
        result.success = true
        result.message = 'upload file success'
        result.fileUrl = "/image?name="+fileName
        console.log('upload file success！')
        resolve(result)
      })
    })

    busboy.on('finish', function( ) {
      console.log('upload file finish')
      resolve(result)
    })

    busboy.on('error', function(err) {
      console.log('upload file error')
      reject(result)
    })

    req.pipe(busboy)
  })

} 

var postImage = async (ctx, next) => {
    let result = { success: false }
    console.log("server File Path is: "+ static_picture_path)
    result = await uploadFile(ctx, static_picture_path)
    ctx.body = result
};


module.exports = {
    'GET /image': getImage,
    'POST /image' : postImage
};
