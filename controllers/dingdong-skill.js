
const logger = require('../utils/logger').logger('dingDongSkill');

//////////////////////////////////////////////////////////////////
const skillList = async (ctx) => {
  const skill = require('../models/dingDongSkill.json')
  ctx.response.type = "application/json";
  ctx.response.status = 200;
  ctx.response.body = JSON.parse(skill);
};

module.exports = {
    'GET /dingdong/skill'  : skillList
};
