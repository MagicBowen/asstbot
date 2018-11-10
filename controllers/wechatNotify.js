var arangoDb = require("../models/arango.js")
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

module.exports = {
  'PUT /formId'  : addFormId
}