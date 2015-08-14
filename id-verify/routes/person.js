exports = module.exports = function(app,models){
	var nciic = new (require('../libs'))(models,{
			// wsdl: require('path').join(__dirname,'../test/nciic/','NciicLocalServices.wsdl') /** ONLY for development */
		});

	var check = function(req,res){
			// res.send(req.body);
			// return;
			var stage;
			if(req.session && req.session.account && req.session.account.business){
				stage = req.session.account.business.stage;
			}
			if(!stage){
				res.send(403,'未授权');
				return;
			}
			var type = req.body.type;
			if(!req.body.type){
				res.send(400,'缺少type参数');
				return;
			}
			var paires = [];
			if(req.body.persons instanceof Array){
				pairs = req.body.persons;
			}else{
				pairs.push(req.body.persons);
			}
			nciic.check(
				pairs, 
				req.session.account, 
				{
					type: 'base',
					stage: stage
				},
				function(err,result){
					if(err){
						res.send(400,result);
						return;
					}
					res.send(result);
				}
			);
		};

	var getCondition = function(req,res){
			nciic.getCondition(function(err, result){
				if(err) throw err;
				res.send(result);
			});
	};

/**
 * router outline
 */
 	app.get('/persons/getCondition', app.isLogined, getCondition);
	//query collection
	app.post('/persons/check', app.isLogined, check);
};