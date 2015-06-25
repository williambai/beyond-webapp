exports = module.exports = function(app,models){
	var async = require('async');
	var config = require('../config/weixin');
	var wechat = require('wechat');
	var mpApi = require('../libs/weixin_api').mpApi; //member platform(mp) service
	var OAuth = require('wechat-oauth');
	// var mpClient = require('../libs/weixin_api').mpClient; //member platform(mp) oauth2
	var qyApi = require('../libs/weixin_api').qyApi; //enterprise(qy) service
	var paymentConfirm = require('../libs/weixin_api').paymentConfirm;

	var mpMiddleware = wechat(config.mp, function(req,res,next){
		next();
	});
	var oAtuthClients = {};//多请求

	app.use('/wechat/check/openid', function(req,res){
		// console.log('/openid ++++++')
		var appid = config.mp.appid;//req.query.appid;
		if(!appid){
			res.sendStatus(400);
			return;	
		}
		if(req.session  && req.session.wechat && req.session.wechat[appid]){
			var openid  = req.session.wechat[appid]['openid'];
			if(openid){
				res.sendStatus(200);
				return;
			}
		}
		res.sendStatus(200);//401
	});

	app.use('/wechat/oauth2',function(req,res){
		var appid = config.mp.appid;//req.query.appid;
		if(!appid){
			res.sendStatus(400);
			return;	
		}
		var redirectUrl = 'http://localhost:8080/wechat/authorized';
		var state = 'state';
		var client  = new OAuth(config.mp.appid, config.mp.secret);//TODO
		req.session.state = state;
		var url = client.getAuthorizeURL(redirectUrl, state, 'snsapi_base');
		oAtuthClients[state] = client;
		res.redirect(url);
	});

	app.use('/wechat/authorized', function(req,res){
		var code = req.query.code;
		var state = req.session.state;
		var client = null;
		if(state){
			client = oAtuthClients[state];
		}
		if(!code || !client){
			delete oAtuthClients[state];
			delete req.session.state;
			res.redirect('/wechat_error.html');
			return;
		}
		client.getAccessToken(code, function (err, result) {
			if(err){
				console.error(err);
				delete oAtuthClients[state];
				delete req.session.state;
				res.redirect('/wechat_error.html');
				return;
			}
			var accessToken = result.data.access_token;
			var openid = result.data.openid;
			req.session.wechat = req.session.wechat || {};
			req.session.wechat[config.mp.appid] = req.session.wechat[config.mp.appid] || {};
			req.session.wechat[config.mp.appid]['openid'] = openid;
			delete oAtuthClients[state];
			delete req.session.state;
			res.redirect('/wechat.html');//回到主程序入口
		});
	});

	app.use('/wechat/project/update', function(req,res){
		var appid = req.query.appid;
		var pid = req.query.pid;
		if(!appid || !pid){
			res.sendStatus(400);
			return;
		}
		/******ONLY for session test begin */
		appid = 'client';
		req.session.wechat = {};
		req.session.wechat[appid] = {};
		req.session.wechat[appid]['openid'] = 'webot';
		/******ONLY end */
		
		if(req.session && req.session.wechat && req.session.wechat[appid]){
			var openid = req.session.wechat[appid]['openid'];
			req.session.wechat[appid]['projectid'] = pid;
			req.sessionStore.get(appid + ':' + openid, function(err, wechatSession){
				if(err){
					console.error(err);
					res.sendStatus(401);
					return;
				}
				var wechatSessionObject = {
						cookie: {
							path: '/', 
							httpOnly: true, 
							originalMaxAge: null,
							expires: null
						},
						accountId: req.session.accountId,
						username: req.session.username,
						avatar: req.session.avatar,
					};
				if(wechatSession){
					wechatSessionObject = wechatSession;
				}
				wechatSessionObject.projectid = pid;

				req.sessionStore.set(appid + ':' + openid, wechatSessionObject, function(err,result){
					if(err){
						console.error(err);
						res.sendStatus(401);
						return;
					}
					res.sendStatus(200);
				});
			});
		}else{
			res.sendStatus(401);
		}
	});

	app.use('/wechat', mpMiddleware, function(req,res){
		var message = req.weixin;
		// console.log('/wechat +++')
		// console.log(req.wxsession)
		// console.log(message)
		if(message.MsgType == 'event'){
			if(message.Event == 'subscribe'){

			}else if(message.Event == 'unsubscribe'){

			}else{
				console.log('waiting to development ....');
				res.reply({
					type: 'text',
					content: 'coming soon ....'
				});
			}
		}else{
			async.waterfall(
				[
					function _project(callback){
						var projectId = req.wxsession.projectid;
						if(!projectId){
							callback(400);
							return;
						}
						models.Project.getById(projectId,function(project){
							if(!project){
								callback(400);
								return;
							}
							//public status in the project
							var accountId = req.wxsession.accountId;
							var username = req.wxsession.username;
							var avatar = req.wxsession.avatar;
							var to = projectId;
							var text = JSON.stringify(message);
							var status = {
									from: to,
									data: {
										userId: accountId,
										username: username,
										avatar: avatar,
										text: text,
									}
								};
							models.Status.add(accountId,to,username,avatar,text);
							app.triggerEvent('project:' + to, status);

							callback(null,project);
						});
					},
					function _reply(project,callback){
						callback(null,{
							type: 'text',
							content: '“' + project.name + '”项目成功接收到您发送的消息。'
						});
					}
				]
				,function _result(err, result){
					if(err){
						res.reply({
							type: 'text',
							content: '错误提示：您还没有选择接收消息的工作项目。请先点击”菜单“>>”我的工作网“，在列表中选择要发送的项目。'
						});
						return;
					}
					//调用weixin消息封装方法
					res.reply(result);				
				}
			);
		}
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