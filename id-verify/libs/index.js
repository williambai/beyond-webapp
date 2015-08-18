var fs = require('fs');
var path = require('path');
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

exports.prototype.check = function(pairs, options, fn){
	var self = this;
	var opts = {
		SBM: 'chinamobiletest', //用户唯一识别码:客户填写各自的业务帐号,集团用户可填写各自的小 帐号,最大长度 40(20 个汉字)
		FSD: '215000',//业务发生地:客户给自己的客户办理业务时的所在地,是 6 位的行政区划编 码,最大长度 6(可以填写 3 个汉字)
		YWLX: '实名验证', //业务类型:客户给自己的客户办理业务时,属于哪种业务类型,最大长度 40(可以填写 20 个汉字)
	};
	if(typeof options == 'function'){
		fn = options;
		options = {};
	}
	options = _.extend(opts, options);
	// console.log(options);
	self.nciic.check(pairs,options,fn);

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

