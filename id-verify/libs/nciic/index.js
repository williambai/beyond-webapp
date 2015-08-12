var fs = require('fs');
var path = require('path');
var https = require('https');
var soap = require('soap');
var xml2js = new require('xml2js').Parser({
		'normalizeTags': true, //lowercase
		'normalize': true,
		'ignoreAttrs':true, 
		'explicitArray':false,
		'explicitCharkey': false,
	});
var builder= require('xmlbuilder');
var IdInfo = require('./IdInfo');

exports = module.exports = function(options){
	var self = this;
	self.inLicense = options.inLicense || path.join(__dirname,'inLicense.txt');
	self.wsdl = options.wsdl || path.join(__dirname,'NciicServices.wsdl');
	self.privatekey = options.privatekey || path.join(__dirname,'privatekey.pem');
	self.certificate = options.certificate || path.join(__dirname,'certificate.pem');
	// create soap client
	soap.createClient(
		self.wsdl,
		function(err,client){
			if(err) throw err;
			client.setSecurity(new soap.ClientSSLSecurity(
				self.privatekey,
				self.certificate,
				{
					// strictSSL: false,
					rejectUnauthorized: false,
					// secureOptions: constants.SSL_OP_NO_TLSv1_2
				}
			));
			self.soapClient = client;
		}
	);
};

exports.protocol = 'soap';

exports.hostname = 'api.nciic.com.cn';

exports.wsdl = '/nciic_ws/services/NciicServices?wsdl';

exports.updateWSDL = function(fn){
	var request = https.request({
			hostname: this.hostname,
			port: 443,
			path: this.wsdl,
			method: 'GET',
			rejectUnauthorized: false
		}, function(response){
			var chunks = '';
			response.on('data',function(chunk){
				chunks += chunk;
			});
			response.on('end',function(){
				fs.writeFileSync(path.join(__dirname, 'NciicServices.wsdl'),chunks);
				fn && fn(null,chunks);
			});
		});
	request.end();
	request.on('error',function(err){
		fn && fn(err);
	});
};

exports.prototype.getCondition = function(inLicense,fn){
	if(typeof inLicense == 'function'){
		fn = inLicense;
		inLicense =  this.inLicense;
	}
	var options = {
		inLicense: inLicense,
	};

	this.soapClient.nciicGetCondition(options,function(err,result){
		fn && fn(err, result);
	});	
};

exports.prototype.nciicCheck = function(inConditions,inLicense,fn){
	if(typeof inLicense == 'function'){
		fn = inLicense;
		inLicense =  this.inLicense;
	}
	var options = {
		inLicense: inLicense,
		inConditions: inConditions
	};

	this.soapClient.nciicCheck(options,function(err,result){
		if(err){
			fn && fn(err);
			return;
		}
		xml2js.parseString(result.out, function(err,json){
			// if(json.rows){
			// 	var rows = json.rows.row;
			// 	res.json(rows);
			// }else{
			// 	res.json(json);
			// }
			fn&& fn(err,json);
		});
	});	
};

exports.prototype.comparePhoto = function(inConditions,inLicense,fn){
	/**-测试代码*/
	/**-fixture test start*/
	// var result_file = fs.readFileSync(path.join(__dirname,'spec','check_photo_result.xml'),{encoding: 'utf8'});
	// // console.log(result_file);
	// var result = xml2js.parseString(result_file.toLowerCase(),function(err,json){
	// 	if(err) throw err;
	// 	var rows = json.rows.row;
	// 	// console.log(rows);
	// 	res.json(rows);
	// });
	/**-fixture test end*/
	//- 真实代码
	if(typeof inLicense == 'function'){
		fn = inLicense;
		inLicense =  this.inLicense;
	}
	var options = {
		inLicense: inLicense,
		inConditions: inConditions
	};
	soapClient.nciicCompare(options,function(err,result){
		if(err) throw err;
		console.log(result.out);
		xml2js.parseString(result.out, function(err,json){
			if(err) throw err;
			if(json.rows){
				var rows = json.rows.row;
				res.json(rows);
			}else{
				res.json(json);
			}
		});
	});
};

exports.prototype.cardInfo = function(persons){
	var result = [];
	for(var i in persons){
		result.push({
			xm: persons[i].name,
			gmsfhm: persons[i].id,
			result: IdInfo.build(persons[i].id)
		});
	}	
};

