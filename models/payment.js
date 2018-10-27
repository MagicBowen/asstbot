
var Payment = require('wechat-pay').Payment
const config = require('../config')

var initConfig = {
  partnerKey: config.partnerkey,
  appId: config.appid,
  mchId: config.mchid,
  notifyUrl: `${config.homeUrl}/payment/notify`
}

var payment = new Payment(initConfig)

var unifyOrder = async (order) => {
  order.trade_type = 'JSAPI'
  order.body = order.body !== undefined ? order.body : '打赏哒尔文'
  return await payment.getBrandWCPayRequestParams(order)
}

module.exports.unifyOrder = unifyOrder