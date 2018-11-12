const postJson = require('../utils/postjson')
const config = require('../config');
const accessTocken = require('../utils/access-tocken');
const logger = require('../utils/logger').logger('wechatNotify');
const arangoDb = require("./arango.js")

async function sendTemplateMsg (openId, templateId, page, data) {
  const tocken = await accessTocken.getTocken()
  const url = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + tocken
  const formId = await arangoDb.getFormId()

  if (!formId) {
    logger.error('No available formId for openId:' + openId)
    throw new Error('No available formId')
  }

  return await postJson(url, {
    template_id: templateId,
    page: page, // "plugin://myPlugin/chatDialog", 
    form_id: formId,
    data,
    emphasis_keyword: "keyword1.DATA",
    touser: openId
  });
}

module.exports.sendTemplateMsg = sendTemplateMsg