exports = module.exports = function(app,models){
	var fs = require('fs');
	var path = require('path');
	var inLicense = fs.readFileSync(path.join(__dirname,'../config','auth_sjtxsjtx49338_1112.txt'),{encoding: 'utf8'});
	// var inLicense = fs.readFileSync(path.join(__dirname,'auth_shldshld43318_1112.txt'),{encoding: 'utf8'});
	//var inLicenseDetail = fs.readFileSync(path.join(__dirname,'.txt'),{encoding: 'utf8'});

	/*check single and multi( xm,hm and xp ). */
	// var inLicenseSimple = fs.readFileSync(path.join(__dirname,'auth_hzgjhzgj48842_3454.txt'),{encoding: 'utf8'});

	/*check detail*/
	// var inLicenseDetail = fs.readFileSync(path.join(__dirname,'auth_hzgjhzgj48842_4958.txt'),{encoding: 'utf8'});

	/* photo check license */
	// var inLicensePhoto = fs.readFileSync(path.join(__dirname,'auth_shldrxbd47888_4777.txt'),{encoding: 'utf8'});

	var nciic = require('../libs/nciic')({
		inLicense: inLicense,
		privatekey: path.join(__dirname,'../config','privatekey.pem'),
		certificate: path.join(__dirname,'../config','certificate.pem')
	});
	
	var async = require('async');
	var Person = models.Person;
	var Record = models.Record;

	var verify = function(req,res){
			// res.send(req.body);
			// return;
			if(req.session && req.session.account && req.session.account.business){
				switch(req.session.account.business.stage){
					case 'test': 
						_verifyTestStage(req,res);
						break;
					case 'dev': 
						_verifyDevStage(req,res);
						break;
					case 'prod':
						_verifyProdStage(req,res);
						break;
					default:
						res.sendStatus(401);
				};
			}else{
				res.sendStatus(400);
			}
		};

	var _verifyTestStage = function(req,res){
			async.waterfall(
				[

				]
				,function(err,result){
					if(err){
						res.sendStatus(400);
						return;
					}
					res.send(result);
				}
			);		
		};

	var _verifyDevStage = function(req,res){
			console.log('dev stage...')
			//one or more check supported
			var pairs = [];
			if(req.body instanceof Array){
				pairs = req.body;
			}else{
				pairs.push(req.body);
			}
			async.waterfall(
				[
					function _person(callback){
						Person.findAll(pairs,function(err,persons){
							callback(err,persons);
						});
					},
					function _process(persons,callback){
						pairs.forEach(function(person){
							person.result = false;
							for(var i in persons){
								if(person.card_id == persons[i].card_id){
									person.credential = true;
									delete persons[i];
									break;
								}
							}
						});
						callback(null,pairs);
					},
					function _record(persons, callback){
						Record.add(req.session.account._id,req.session.account.username,'身份校验', persons.length, 0, 'dev', JSON.stringify(persons));
						callback(null,persons);
					}
				]
				,function(err,result){
					if(err){
						res.sendStatus(400);
						return;
					}
					res.send(result);
				}
			);		
		};
	var _verifyProdStage = function(req,res){
			async.waterfall(
				[

				]
				,function(err,result){
					if(err){
						res.sendStatus(400);
						return;
					}
					res.send(result);
				}
			);		
		};
/**
 * router outline
 */
	//query collection
	app.post('/persons/verify', app.isLogined, verify);
};