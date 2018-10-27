
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
  order.body = {}
  return await payment.getBrandWCPayRequestParams(order)
}

module.exports.unifyOrder = unifyOrder