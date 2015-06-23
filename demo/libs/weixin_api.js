var config = require('../config/weixin');

var WechatAPI = require('wechat-api');
var EnterpriseAPI = require('wechat-enterprise').API;
var OAuth = require('wechat-oauth');
var Payment = require('wechat-payment').Payment;
var PaymentConfirm = require('wechat-payment').middleware;

var mpApi = new WechatAPI(config.mp.appid, config.mp.secret);
var mpClient = new OAuth(config.mp.appid, config.mp.secret);

var qyApi = new EnterpriseAPI(config.qy.corpid, config.qy.secret, config.qy.agentid);
var qyClient = new OAuth(config.qy.corpid, config.qy.secret);

var payment = new Payment(config.payment);
var paymentConfirm = PaymentConfirm(config.payment).getNotify().done;

exports = module.exports = {
	mpApi: mpApi,
	mpClient: mpClient,
	qyApi: qyApi, 
	qyClient: qyClient,
	payment: payment,
	paymentConfirm: paymentConfirm,
};
