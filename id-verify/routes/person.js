exports = module.exports = function(app,models){
	var async = require('async');

	var nciic = new (require('../libs'))(models,{
			// wsdl: require('path').join(__dirname,'../test/nciic/','NciicLocalServices.wsdl') /** ONLY for development */
		});

	var _checkAuthorization = function(req,res,next){
		var type = req.query.type;
		if(!type){
			res.send({errcode:40000,errmsg: '缺少type参数'});
			return;
		}
		var businessTypes = req.session.account && 
							req.session.account.business && 
							req.session.account.business.types;

		if(!(businessTypes && businessTypes[type])){
			res.send({errcode: 40300, errmsg: 'business.types 未授权'});
			return;
		}
		var businessStage = req.session.account.business.stage;
		if(!businessStage){
			res.send({errcode: 40301, errmsg: '未授权'});
			return;
		}
		var price = req.session.account.business && 
						req.session.account.business.prices && 
						req.session.account.business.prices[type];
		if(businessStage == 'test'){
			var businessTimes = req.session.account && 
									req.session.account.business &&
									req.session.account.business.times;
			if(businessTimes[type] && businessTimes[type] > 0){
				res.locals.account = {
					times: businessTimes[type],
					price: price	
				};
				next();
			}else{
				res.send({errcode:40300,errmsg: '可用次数为0，无法使用。'});
			}
		}else if(businessStage == 'prod'){
			var balance = req.session.account.balance;
			if(balance > 0){
				res.locals.account = {
					times: parseInt(balance/price),
					price: price	
				};
				next();
			}else{
				res.send({errcode:40301,errmsg: '账户余额不足，无法使用。'});
			}
		}else{
			res.locals.account = {
				times: -1,
				price: price	
			};
			next();
		}
	};

	var check = function(req,res,next){
			var type = req.query.type;
			var sbm = req.query.userid || 'pdbang';
			var fsd = req.query.place || '苏州';
			var ywlx = req.query.category || '网上身份校验';

			var stage = req.session.account && 
							req.session.account.business && 
							req.session.account.business.stage;
			var pairs = [];
			if(req.body.persons instanceof Array){
				pairs = req.body.persons;
			}else{
				pairs.push(req.body.persons);
			}
			req.body.persons = pairs;
			var account = req.session.account;
			var accountId = req.session.account && req.session.account._id;
			var price = req.session.account.business && 
							req.session.account.business.prices && 
							req.session.account.business.prices[type];

			async.waterfall(
				[
					function _person(callback){
						if(stage == 'dev'){
							models.Person.findAll(pairs,function(err,persons){
								if(err){
									callback(err);
									return;
								}
								pairs.forEach(function(person){
									person.credential = false;
									for(var i in persons){
										if(person.card_id == persons[i].card_id && person.card_name == persons[i].card_name){
											if(type == 'verify' || type == 'base' || type == 'whole'){
												person.credential = true;
											}
											if(type == 'base' || type == 'whole'){
												var content = persons[i].content;
												person.result_xm = (content && content.xm);
												person.result_gmsfhm = (content && content.gmsfhm);
												person.result_zt = (content && content.zt);
												person.result_zxbs = (content && content.zxbs);
												person.result_cym = (content && content.cym);
												person.result_xb = (content && content.xb);
												person.result_mz = (content && content.mz);
												person.result_csrq = (content && content.csrq);
												person.result_ssssxq = (content && content.ssssxq);
												person.result_csdssx = (content && content.csdssx);
												person.result_zz = (content && content.zz);
												person.result_fwcs = (content && content.fwcs);
												person.result_hyzk = (content && content.hyzk);
												person.result_whcd = (content && content.whcd);
											}
											if(type == 'whole'){
												person.result_xp = (content && content.xp);
												person.result_rts = (content && content.rts);
											}
											delete persons[i];
											break;
										}
									}
								});
								callback(null,pairs);
							});
						}else{
							pairs.forEach(function(person){
								person.credential = false;
							});
							callback(null, pairs);
						}
					},
					function _nciic(pairs,callback){
						if(stage == 'test' || stage == 'prod'){
							var unchecked = [];
							pairs.forEach(function(person){
								if(!person.credential){
									unchecked.push(person);
								}
							});
							nciic.check(unchecked,function(err,persons){
								if(err){
									callback(err);
									return;
								}
								pairs.forEach(function(person){
									for(var i in persons){
										if(person.card_id == persons[i].gmsfhm || person.card_name == persons[i].xm){
											if(type == 'verify' || type == 'base' || type == 'whole'){
												if(persons[i].result_xm == '一致'){
													person.credential = true;
												}
											}
											if(type == 'base' || type == 'whole'){
												person.result_xm = persons[i].result_xm;
												person.result_gmsfhm = persons[i].result_gmsfhm;
												person.result_xm = persons[i].result_xm;
												person.result_gmsfhm = persons[i].result_gmsfhm;
												person.result_zt = persons[i].result_zt;
												person.result_zxbs = persons[i].result_zxbs;
												person.result_cym = persons[i].result_cym;
												person.result_xb = persons[i].result_xb;
												person.result_mz = persons[i].result_mz;
												person.result_csrq = persons[i].result_csrq;
												person.result_ssssxq = persons[i].result_ssssxq;
												person.result_csdssx = persons[i].result_csdssx;
												person.result_zz = persons[i].result_zz;
												person.result_fwcs = persons[i].result_fwcs;
												person.result_hyzk = persons[i].result_hyzk;
												person.result_whcd = persons[i].result_whcd;
											}
											if(type == 'whole'){
												person.result_xp = persons[i].result_xp;
												person.result_rts = persons[i].result_rts;
											}
											delete persons[i];
											break;
										}
									}
								});
								callback(null,pairs);
							});
						}else{
							callback(null,pairs);
						}

					},
					function _record(pairs, callback){
						if(stage == 'test' || stage == 'prod'){
							models.Record.add(accountId,
								account.username,
								'身份校验', 
								sbm,
								fsd,
								ywlx,
								pairs.length, 
								price,
								stage,
								JSON.stringify(pairs)
							);
							callback(null,pairs);
						}else{
							callback(null,pairs);
						}
					},
					function _account(persons, callback){
						var limits = {};
						if(stage == 'test'){
							models.Account.updateTimes(accountId,type,-1,function(err,account){
								req.session.account.business.times[type] = account.business.times[type];
							});
							limits = {
								times: parseInt(req.session.account.business.times[type] - 1),
								price: price	
							};
						}else if(stage == 'prod'){
							var cost = price * res.body.persons.length;
							models.Account.updateBalance(accountId,cost,function(err,account){
								req.session.account.balance = account.balance;
							});
							limits = {
								times: parseInt((req.session.account.balance - cost)/price),	
								price: price
							};
						}else{
							limits = {
								times: -1,
								price: price	
							};
						}
						callback(null, {
							account: limits,
							persons: persons
						});
					},
				],
				function(err,result){
					if(err){
						console.error('person check exception.');
						console.error(err);
						res.send(err);
						return;
					}
					res.send(result);
				}
			);
		};

	var getCondition = function(req,res){
			nciic.getCondition(function(err, result){
				if(err){
					res.send(err);
					return;
				}
				res.send(result);
			});
	};

	var getTimes = function(req,res){
		res.send(res.locals);		
	};
/**
 * router outline
 */

	/**
	 * query collection
	 * type:
	 * 	    verify
	 * 	    base
	 * 	    whole
	 */
	app.post('/persons/check', app.isLogined, _checkAuthorization, check);

	app.get('/persons/times', app.isLogined, _checkAuthorization, getTimes);
 	app.get('/persons/getCondition', app.isLogined, getCondition);

};