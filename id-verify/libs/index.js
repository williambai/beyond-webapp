var fs = require('fs');
var path = require('path');
var async = require('async');
var _ = require('underscore');
var IdInfo = require('./card_id_info');

var inLicense = fs.readFileSync(path.join(__dirname,'../config','auth_sjtxsjtx49338_1112.txt'),{encoding: 'utf8'});
// var inLicense = fs.readFileSync(path.join(__dirname,'auth_shldshld43318_1112.txt'),{encoding: 'utf8'});
//var inLicenseDetail = fs.readFileSync(path.join(__dirname,'.txt'),{encoding: 'utf8'});

/*check single and multi( xm,hm and xp ). */
// var inLicenseSimple = fs.readFileSync(path.join(__dirname,'auth_hzgjhzgj48842_3454.txt'),{encoding: 'utf8'});

/*check detail*/
// var inLicenseDetail = fs.readFileSync(path.join(__dirname,'auth_hzgjhzgj48842_4958.txt'),{encoding: 'utf8'});

/* photo check license */
// var inLicensePhoto = fs.readFileSync(path.join(__dirname,'auth_shldrxbd47888_4777.txt'),{encoding: 'utf8'});


exports = module.exports = function(models,options){
	var opts = {
		inLicense: inLicense,
		privatekey: path.join(__dirname,'../config','privatekey.pem'),
		certificate: path.join(__dirname,'../config','certificate.pem')
	};
	if(!options){
		options = {};
	}
	options = _.extend(opts, options);
	this.options = options;
	this.models = models;
	this.nciic = new (require('./nciic'))(options);
};


exports.prototype.getCondition = function(options,fn){
	if(typeof options == 'function'){
		fn = options;
		options = {};
	}
	this.nciic.getCondition(options,fn);
};

exports.prototype.check = function(pairs, operator, options, fn){
	var opts = {
		type: 'verify', //业务类型 verify,base,whole
		stage: 'dev', //阶段 test,dev,prod
		record: true, //记录操作日志
		SBM: 'chinamobiletest', //用户唯一识别码:客户填写各自的业务帐号,集团用户可填写各自的小 帐号,最大长度 40(20 个汉字)
		FSD: '215000',//业务发生地:客户给自己的客户办理业务时的所在地,是 6 位的行政区划编 码,最大长度 6(可以填写 3 个汉字)
		YWLX: '实名验证', //业务类型:客户给自己的客户办理业务时,属于哪种业务类型,最大长度 40(可以填写 20 个汉字)
	};
	if(typeof options == 'function'){
		fn = options;
		options = {};
	}
	options = _.extend(opts, options);
	console.log(options);
	var Person = this.models.Person;
	var Record = this.models.Record;
	async.waterfall(
		[
			function _person(callback){
				if(options.stage == 'dev'){
					Person.findAll(pairs,function(err,persons){
						if(err){
							callback(err);
							return;
						}
						pairs.forEach(function(person){
							person.credential = false;
							for(var i in persons){
								if(person.card_id == persons[i].card_id && person.card_name == persons[i].card_name){
									if(options.type == 'verify' || options.type == 'base' || options.type == 'whole'){
										person.credential = true;
									}
									if(options.type == 'base' || options.type == 'whole'){
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
									if(options.type == 'whole'){
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
			function _remote(pairs,callback){
				if(options.stage == 'test' || options.stage == 'prod'){
					var unchecked = [];
					pairs.forEach(function(person){
						if(!person.credential){
							unchecked.push(person);
						}
					});
					nciic.check(unchecked,options,function(err,persons){
						if(err){
							callback('remote服务不可用');
							return;
						}
						pairs.forEach(function(person){
							for(var i in persons){
								if(person.card_id == persons[i].gmsfhm || person.card_name == persons[i].xm){
									if(options.type == 'verify' || options.type == 'base' || options.type == 'whole'){
										if(persons[i].result_xm == '一致'){
											person.credential = true;
										}
									}
									if(options.type == 'base' || options.type == 'whole'){
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
									if(options.type == 'whole'){
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

			function _account(pairs,callback){
				if(options.stage == 'test' || options.stage == 'prod'){

				}else{
					callback(null,pairs);
				}
			},

			function _record(pairs, callback){
				if(options.stage == 'test' || options.stage == 'prod'){
					Record.add(operator._id,operator.username,'身份校验', pairs.length, 0, 'dev', JSON.stringify(pairs));
					callback(null,pairs);
				}else{
					callback(null,pairs);
				}
			}
		]
		,function(err,result){
			fn(err, result);
		}
	);	
};

var comparePhoto = function(pairs, operator, options,fn){

};

var cardInfo = function(persons){
	var result = [];
	for(var i in persons){
		result.push({
			xm: persons[i].name,
			gmsfhm: persons[i].id,
			result: IdInfo.build(persons[i].id)
		});
	}	
};

