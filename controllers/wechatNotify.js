var arangoDb = require("../models/arango.js")
var sendTemplateMsg = require("../models/wechatNotify.js").sendTemplateMsg
const logger = require('../utils/logger').logger('dictateWords')

const addFormId = async (ctx) => {
  try {
    arangoDb.addFormId(ctx.request.body.id, ctx.request.body.formId);
    ctx.response.type = "application/json";
    ctx.response.status = 200;
    ctx.response.body = {result : 'success'};
  } catch(err) {
      ctx.response.status = 404;
      ctx.response.body = {result : 'failed', cause : err.toString()};
      logger.error(`add form id ` + err.stack);
  }
}

const askRelogin = async (ctx) => {
  try {
    const templateId = 'KS5Q1MoVjvleCKr_Ajf0561iEeIBakWij7Eh0GGTBK8'
    const openId = ctx.request.body.openId
    if (!openId) {
      throw new Error('openId is not exist')
    }
    const data = {
      keyword1: {
        value: ctx.request.body.hint
      },
      keyword2: {
        value: ctx.request.body.activity
      },
      keyword3: {
        value: ctx.request.body.score
      }
    }
    const result = sendTemplateMsg(openId, templateId, 'pages/index/main', data)

    logger.debug(`send template msg result : ${JSON.stringify(result)}`)
    
    ctx.response.type = "application/json"
    ctx.response.status = 200
    ctx.response.body = result
  } catch (err) {
    ctx.response.status = 404
    ctx.response.body = err
    logger.error('send template msg error: ' + err)
  }
}

module.exports = {
  'PUT /formId'  : addFormId,
  'POST /notify/relogin' : askRelogin
}