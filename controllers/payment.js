const logger = require('../utils/logger').logger('payment')
const payment = require('../models/payment')

const unifyOrder = async (ctx) => {
  const msg = ctx.request.body
  logger.debug(`receive order from client: ${JSON.stringify(msg)}`)

  const openid = msg.openId
  const total_fee = msg.totalFee

  if (!openid || !total_fee) {
    ctx.response.status = 404;
    logger.error('message header format error, no openid or no total_fee');
    return;
  }

  try {
    const response = await payment.unifyOrder({openid, total_fee, out_trade_no: 'kfc' + (+new Date), 
      spbill_create_ip: ctx.request.ip});
    ctx.response.type = "application/json";
    ctx.response.status = 200;
    ctx.response.body = response;
  } catch (err) {
      ctx.response.status = 404;
      logger.error('payment error: ' + err);
  }
}

const notify = async (ctx) => {
  const msg = ctx.request.body
  logger.debug(`receive notify from server: ${JSON.stringify(msg)}`)  
  ctx.response.type = "application/json";
  ctx.response.status = 200;  
}

module.exports = {
  'POST /payment/unifyOrder' : unifyOrder,
  'POST /payment/notify' : notify
}