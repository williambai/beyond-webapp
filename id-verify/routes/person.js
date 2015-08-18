exports = module.exports = function(app,models){
	var nciic = new (require('../libs'))(models,{
			// wsdl: require('path').join(__dirname,'../test/nciic/','NciicLocalServices.wsdl') /** ONLY for development */
		});

	var _hasRightDoNext = function(req,res,next){
		var type = req.query.type;
		if(!type){
			res.send(400,'缺少type参数');
			return;
		}
		var businessTypes = req.session.account && 
							req.session.account.business && 
							req.session.account.business.types;

		if(!(businessTypes && businessTypes[type])){
			res.send({errcode: 40300, errmsg: '未授权'});
			return;
		}
		var businessStage = req.session.account.business.stage;
		if(!businessStage){
			res.send({errcode: 40301, errmsg: '未授权'});
			return;
		}
		if(businessStage == 'test'){
			var businessTimes = req.session.account.business.times;
			if(businessTimes[type] && businessTimes[type] > 0){
				next();
			}else{
				res.send(403,'次数为0，无法使用。');
			}
		}else if(businessStage == 'prod'){
			var balance = req.session.account.balance;
			if(balance > 0){
				next();
			}else{
				res.send(403,'账户余额不足，无法使用。');
			}
		}else{
			next();
		}
	};

	var _final = function(req,res){
		var price = req.session.account.business.prices[type];
		var accountId = req.session.account._id;
		var businessStage = req.session.account.business.stage;
		var type = req.query.type;
		if(businessStage == 'test'){
			models.Account.updateTimes(accountId,type,-1,function(err,account){
				req.session.account.business.times[type] = account.business.times[type];
			});
			res.locals.account = {
				times: parseInt(req.session.account.business.times[type] - 1),
				price: price	
			};
		}else if(businessStage == 'prod'){
			var cost = price * res.body.persons.length;
			models.Account.updateBalance(accountId,cost,function(err,account){
				req.session.account.balance = account.balance;
			});
			res.locals.account = {
				times: parseInt((req.session.account.balance - cost)/price),	
				price: price
			};
		}else{
			res.locals.account = {
				times: -1,
				price: price	
			};
		}
		res.send(res.locals);
	};

	var check = function(req,res,next){
			// res.send(req.body);
			// return;
			var type = req.query.type;
			var stage = req.session.account.business.stage;

			var pairs = [];
			if(req.body.persons instanceof Array){
				pairs = req.body.persons;
			}else{
				pairs.push(req.body.persons);
			}
			req.body.persons = pairs;

			nciic.check(
				pairs, 
				req.session.account, 
				{
					type: type,
					stage: stage
				},
				function(err,result){
					if(err){
						res.send(400,result);
						return;
					}
					res.locals.persons = result;
					next();
				}
			);
		};

	var getCondition = function(req,res){
			nciic.getCondition(function(err, result){
				if(err) throw err;
				res.send(result);
			});
	};

	var getTimes = function(req,res){
		var businessStage = req.session.account.business.stage;
		var type = req.query.type;
		var price = req.session.account.business.prices[type];
		if(businessStage == 'test'){
			res.locals.account = {
				times: req.session.account.business.times[type],
				price: price	
			};
		}else if(businessStage == 'prod'){
			var cost = price * res.body.persons.length;
			res.locals.account = {
				times: parseInt((req.session.account.balance - cost)/price),
				price: price	
			};
		}else{
			res.locals.account = {
				times: -1,
				price: price	
			};
		}
		res.send(res.locals);		
	};
/**
 * router outline
 */
 	app.get('/persons/getCondition', app.isLogined, getCondition);
	//query collection
	app.post('/persons/check', app.isLogined, _hasRightDoNext, check, _final);

	app.get('/persons/times', app.isLogined, _hasRightDoNext, getTimes);

};