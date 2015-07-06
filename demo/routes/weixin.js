exports = module.exports = function(app,models){
	var path = require('path');
	var fs = require('fs');
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
		var originid = config.mp.originid;//req.query.originid;
		if(!originid){
			res.sendStatus(400);
			return;	
		}
		if(req.session  && req.session.wechat && req.session.wechat[originid]){
			var openid  = req.session.wechat[originid]['openid'];
			if(openid){
				res.sendStatus(200);
				return;
			}
		}
		res.sendStatus(200);//401
	});

	app.use('/wechat/oauth2',function(req,res){
		var originid = config.mp.originid;//req.query.originid;
		if(!originid){
			res.sendStatus(400);
			return;	
		}
		var redirectUrl = 'http://'+ req.header('host') +'/wechat/authorized';
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
			console.log('++++')
			console.log(openid);
			req.session.wechat = req.session.wechat || {};
			req.session.wechat[config.mp.originid] = req.session.wechat[config.mp.originid] || {};
			req.session.wechat[config.mp.originid]['openid'] = openid;
			delete oAtuthClients[state];
			delete req.session.state;
			res.redirect('/wechat.html');//回到主程序入口
		});
	});

	app.use('/wechat/project/update', function(req,res){
		var originid = req.query.originid;
		var pname = req.query.pname;
		var pid = req.query.pid;
		if(!originid || !pid){
			res.sendStatus(400);
			return;
		}
		/******ONLY for session test begin */
		originid = config.mp.originid;//'gh_205afa8af9b0';
		req.session.wechat = {};
		req.session.wechat[originid] = {};
		req.session.wechat[originid]['openid'] = 'olnndt1IVnyRIgRs0vRGgUHM3Ljw';
		/******ONLY end */
		
		if(req.session && req.session.wechat && req.session.wechat[originid]){
			var openid = req.session.wechat[originid]['openid'];
			req.session.wechat[originid]['projectid'] = pid;
			req.sessionStore.get(openid + ':' + originid, function(err, wechatSession){
				if(err){
					console.error(err);
					res.sendStatus(401);
					return;
				}

				if(!wechatSession){
					wechatSession = {
						cookie: {
							path: '/', 
							httpOnly: true, 
							originalMaxAge: null,
							expires: null
						},
					};
				}
				wechatSession.accountId = req.session.accountId,
				wechatSession.username = req.session.username,
				wechatSession.avatar = req.session.avatar,
				wechatSession.projectid = pid;
				wechatSession.projectName = pname; 

				req.sessionStore.set(openid + ':' + originid, wechatSession, function(err,result){
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
		console.log('/wechat +++')
		console.log(req.wxsession)
		console.log(message)
		if(message.MsgType == 'event'){
			//收到事件消息
			if(message.Event == 'subscribe'){
				res.reply({
					type: 'text',
					content: 'coming soon ....'
				});
				console.log('waiting to development ....');
			}else if(message.Event == 'unsubscribe'){
				res.reply({
					type: 'text',
					content: 'coming soon ....'
				});
				console.log('waiting to development ....');
			}else if(message.Event == 'CLICK'){
				if(message.EventKey == 'key_static_help_more_publish'){
					//发布更多
					res.reply([
						{
							title: '更多发布',
							description: 'coming soon ....',
							picurl: 'http://sw.appmod.cn/upload/1433476695765.jpg',
							url: 'http://sw.appmod.cn/helps/help_publish.html'
						}
					]);

				}else if(message.EventKey == 'key_static_help_pre_condition'){
					//前提条件
					res.reply({
						type: 'text',
						content: 'coming soon ....'
					});

				}else if(message.EventKey == 'key_static_help_demo'){
					//产品演示
					res.reply({
						type: 'text',
						content: 'coming soon ....'
					});

				}else if(message.EventKey == 'key_static_help_contact_us'){
					//联系我们
					res.reply({
						type: 'text',
						content: 'coming soon ....'
					});

				}else if(message.EventKey == 'key_static_help_cooperation_for_win'){
					//合作共赢
					res.reply({
						type: 'text',
						content: 'coming soon ....'
					});

				}else if(message.EventKey == 'key_static_help_product_introdution'){
					//产品介绍
					res.reply({
						type: 'text',
						content: 'coming soon ....'
					});
				}else{
					res.reply({});
				}
			}else{
				res.reply({});
				console.log(message.Event + 'waiting to development ....');
			}
		}else if(message.MsgType == 'text' || message.MsgType == 'image' || message.MsgType == 'voice' || message.MsgType == 'video' || message.MsgType == 'shortvideo' || message.MsgType == 'link' || message.MsgType == 'location'){
			//收到普通消息，不等处理，立即回复
			if(!req.wxsession.projectid){
				res.reply({
						type: 'text',
						content: '该消息丢弃，因为您还没有选择项目。请先选择一个项目，重新发送。'
					});
				return;
			}
			res.reply({
					type: 'text',
					content: req.wxsession.projectName + '项目已成功接收您发送的消息。'
				});
			//慢慢处理
			async.waterfall(
				[
					function _download_MediaId(callback){
						if(!message.MediaId){
							callback(null,message);
						}else{
							mpApi.getMedia(message.MediaId,function(err,result,response){
								if(err){
									callback(null,message);
									console.log('Warning: MediaId('+ message.MediaId + ') download failure.');
									return;
								}
								console.log('++++')
								console.log(result);
								var filename  = '';
								if(message.MsgType == 'image'){
									var subfix = '.png';//message.PicUrl.substr(message.PicUrl.lastIndexOf('.')) || '';
									filename = '/_tmp/wechat/' + message.MediaId + subfix;
								}else if(message.MsgType == 'voice'){
									filename = '/_tmp/wechat/' + message.MediaId;
								}else if(message.MsgType == 'shortvideo'){
									filename = '/_tmp/wechat/' + message.MediaId;
								}
								fs.writeFile(path.join(__dirname,'../public',filename), result, function(err){
									if(err){
										callback(err,null);
									}else{
										message.Url = filename;
										callback(null,message);
									}
								});
							});
						}
					},
					function _download_ThumbMediaId(msg,callback){
						if(!msg.ThumbMediaId){
							callback(null,msg);
						}else{
							mpApi.getMedia(msg.ThumbMediaId,function(err,result,response){
								if(err){
									callback(null,message);
									console.log('Warning: ThumbMediaId('+ message.MediaId + ') download failure.');
									return;
								}
								var filename = '/_tmp/wechat/' + msg.ThumbMediaId;
								fs.writeFile(path.join(__dirname,'../public',filename), result, function(err){
									if(err){
										callback(err,null);
									}else{
										msg.ThumbUrl = filename;
										callback(null,msg);
									}
								});
							});
						}
					},
					function _transform(msg,callback){
						callback(null,msg);
					},
					function _project(msg,callback){
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
							var text = JSON.stringify(msg);

							models.Status.add(accountId,to,username,avatar,'','',text);

							var status = {
									from: to,
									data: {
										userId: accountId,
										username: username,
										avatar: avatar,
										text: text,
									}
								};
							app.triggerEvent('project:' + to, status);

							callback(null,true);
						});
					}
				]
				,function _result(err, success){
					if(err){
						console.error(err);
						return;
					}
					if(!success){
						console.error('message from wechat to project '+ req.wxsession.projectid +' transfer failure.');
						return;
					}
				}
			);
		}else{
			res.reply({});
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