exports = module.exports = function(){
	var config = require('../config/weixin');

	var wechatAPI = require('wechat-api');
	var api = new wechatAPI(config.appid, config.secret);

	var OAuth = require('wechat-oauth');
	var client = new OAuth(config.appid,config.secret);

	var Payment = require('wechat-payment').Payment;
	var payment = new Payment(config.payment);


	var PaymentConfirm = require('wechat-payment').middleware;
	var paymentConfirm = PaymentConfirm(config.payment).getNotify().done;

	return {
		api: api,
		client: client,
		payment: payment,
		paymentConfirm: paymentConfirm,
	};
}