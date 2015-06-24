exports = module.exports = function(app,models){
	var async = require('async');
	var config = require('../config/weixin');
	var wechat = require('wechat');
	var mpApi = require('../libs/weixin_api').mpApi; //member platform(mp) service
	var qyApi = require('../libs/weixin_api').qyApi; //enterprise(qy) service
	var paymentConfirm = require('../libs/weixin_api').paymentConfirm;

	var mpMiddleware = wechat(config.mp, function(req,res,next){
		next();
	});

	app.use('/wechat', mpMiddleware, function(req,res){
		var message = req.weixin;
		console.log('+++')
		console.log(req.session)
		console.log(req.wxsession)
		console.log(message)
		async.waterfall(
			[
				
			]
			,function _result(err, result){
				if(err){
					res.sendStatus(err);
					return;
				}
				//调用weixin消息封装方法
				res.reply(result);				
			}
		);
	});

	var qyMiddleware = wechat(config.qy, function(req,res,next){
		next();
	});

	app.use('/corp', qyMiddleware, function(req,res){
		var message = req.weixin;
		async.waterfall(
			[
				
			]
			,function _result(err, result){
				if(err){
					res.sendStatus(err);
					return;
				}
				//调用weixin消息封装方法
				res.reply(result);				
			}
		);
	});

	var paymentMiddleware = function(message,req,res,next){
			var openid = message.openid;
			var order_id = message.out_trade_no;
			var attach = {};
			try{
				attach = JSON.parse(message.attach);
			}catch(err){
				console.err(err);
			}
			next();
		};
		
	app.use(config.payment.notifyUrl, paymentMiddleware, mpMiddleware, function(req,res){
		/**
		* 查询订单，在自己系统里把订单标为已处理
		* 如果订单之前已经处理过了直接返回成功
		*/
		res.reply('success');

		/**
		* 有错误返回错误，不然微信会在一段时间里以一定频次请求你
		* res.reply(new Error('...'))
		*/
  	});
};