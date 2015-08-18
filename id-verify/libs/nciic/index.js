var fs = require('fs');
var path = require('path');
var https = require('https');
var _ = require('underscore');
var soap = require('soap');
var builder= require('xmlbuilder');
var xml2json = require('xml2json');
var xml2js = new require('xml2js').Parser({
		'normalizeTags': true, //lowercase
		'normalize': true,
		'ignoreAttrs':true, 
		'explicitArray':false,
		'explicitCharkey': false,
	});

exports = module.exports = function(options){
	var opts = {
		wsdl: path.join(__dirname,'NciicServices.wsdl'),
	};
	options = _.extend(opts,options);	
	this.options = options;
	if(!options.inLicense || !options.privatekey || !options.certificate){
		throw new Error('options.inLicense, privatekey or certificate is lost.');
	}
	// create soap client
	var self = this;
	soap.createClient(
		options.wsdl,
		function(err,client){
			if(err) throw err;
			client.setSecurity(new soap.ClientSSLSecurity(
				options.privatekey,
				options.certificate,
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

exports.prototype.getCondition = function(options,fn){
	options = _.extend(this.options,options);
	if(!options.inLicense) throw new Error('options.inLicense is lost.');
	var args = {
		inLicense: options.inLicense,
	}
	this.soapClient.nciicGetCondition(args,function(err,result){
		if(err){
			console.error('nciic remote server getCondition: ');
			console.error(err);
			fn && fn({errcode: 500100, errmsg: 'remote server exceptions.'});
			return;
		}
		var out = xml2json.toJson(result.out.toLowerCase());
		try{
			out = JSON.parse(out);
		}catch(err){
			fn && fn({errcode: 500111, errmsg: 'remote数据解析异常'});
			return;
		}
		if(out.response){
			var response = out.response;
			var error = {};
			if(response.rows){
				if(response.rows.row){
					var _error = response.rows.row;
					if(_error.errorcode){
						error.errcode = _error.errorcode;
					}
					if(_error.errormsg){
						error.errmsg = 'remote server exceptions, ' + _error.errormsg;
					}
				}
			}
			fn && fn(error);
			return;
		}
		fn && fn(null, out);
	});	
};

exports.prototype.check = function(persons,options,fn){
	options = _.extend(this.options,options);
	if(!options.inLicense || !options.SBM || !options.FSD || ! options.YWLX){
		 throw new Error('options arguments is lost.');
	}
	//build xml
	var rows = builder.create('ROWS');
	rows.ele('INFO').ele('SBM',options.SBM);
	var row = rows.ele('ROW');
	row.ele('GMSFHM','公民身份号码');
	row.ele('XM','姓名');
	for(var i in persons){
		row = rows.ele('ROW',{'FSD':options.FSD,'YWLX':options.YWLX});
		row.ele('GMSFHM',persons[i].card_id);
		row.ele('XM',persons[i].card_name);
	}
	var inConditions = rows.end();

	var args = {
		inLicense: options.inLicense,
		inConditions: inConditions
	};

	this.soapClient.nciicCheck(args,function(err,result){
		if(err){
			console.error('nciic remote server check: ');
			console.error(err);
			fn && fn({errcode: 500100, errmsg: 'remote server exceptions.'});
			return;
		}
		var out = xml2json.toJson(result.out.toLowerCase());
		try{
			out = JSON.parse(out);
		}catch(err){
			fn && fn({errcode: 500111, errmsg: 'remote数据解析异常'});
			return;
		}
	
		if(out.response){
			var response = out.response;
			var error = {};
			if(response.rows){
				if(response.rows.row){
					var _error = response.rows.row;
					console.log(_error)
					if(_error.errorcode){
						error.errcode = _error.errorcode;
					}
					if(_error.errormsg){
						error.errmsg = 'remote server exceptions, ' + _error.errormsg;
					}
				}
			}
			fn && fn(error);
			return;
		}
		if(!(out && out.rows && out.rows.row)){
			fn && fn({errcode: 500110, errmsg: 'remote数据不完整'});
			return;
		}
		var error = null;
		var outPersons = [];

		var rows = (out.rows.row instanceof Array) ? out.rows.row : [out.rows.row];
		rows.forEach(function(row,index){
			if(row.errorcode){
				error = {
					errcode: row.errorcode,
					errmsg: row.errormsg || ''
				};
			}else{
				var outPerson = {};
				if(row.input){//<!--输入项节点-->
					var input = row.input;
					outPerson.gmsfhm = input.gmsfhm;//<!--公民身份号码-->
					outPerson.xm = input.xm;//<!--姓名-->
				}
				if(row.output){//<!--输出项节点-->
					var output = row.output;
					if(output.item){
						var item = output.item;
						if(item.errormesage){
							outPerson.errormesage = item.errormesage; 
						}
						if(item.errormesagecol){
							outPerson.errormesagecol = item.errormesagecol;
						}
						if(item.gmsfhm){ //
							var gmsfhm = item.gmsfhm;
							if(gmsfhm.result_gmsfhm){//<!--公民身份号码的核查结果:注销人员的文字描述-->
								var result_gmsfhm = gmsfhm.result_gmsfhm;
								outPerson.result_gmsfhm = result_gmsfhm.trim();
							}
						}
						if(item.xm){
							var xm = item.xm;
							if(xm.result_xm){//<!--姓名的核查结果-->
								var result_xm = xm.result_xm;
								outPerson.result_xm = result_xm.trim();
							}
						}
						if(item.zt){//<!--注销状态描述-->
							outPerson.result_zt = item.zt;
						}
						if(item.zxbs){//<!--注销标识-->
							outPerson.result_zxbs = item.zxbs;
						}
						if(item.cym){//<!—曾用名-->
							outPerson.result_cym = item.cym;
						}
						if(item.xb){ //<!--性别-->
							outPerson.result_xb = item.xb;
						}
						if(item.mz){ //<!--民族-->
							outPerson.result_mz = item.mz;
						}
						if(item.csrq){ //<!—出生日期-->
							outPerson.result_csrq = item.csrq;
						}
						if(item.ssssxq){//<!—所属省市县区-->
							outPerson.result_ssssxq = item.ssssxq;
						}
						if(item.csdssx){//<!—出生地省市县区-->
							outPerson.result_csdssx = item.csdssx;
						}
						if(item.zz){//<!—住址-->
							outPerson.result_zz = item.zz;
						}
						if(item.fwcs){//<!—服务处所-->
							outPerson.result_fwcs = item.fwcs;
						}
						if(item.hyzk){//<!—婚姻状况-->
							outPerson.result_hyzk = item.hyzk;
						}
						if(item.whcd){//<!—文化程度-->
							outPerson.result_whcd = item.whcd;
						}
						if(item.xp){//<!—相片(Base64 编码)-->
							outPerson.result_xp = item.xp;
						}
					}
				}
				if(row.rts){
					if(row.rts.rt){
						var rts = (row.rts.rt instanceof Array) ? row.rts.rt : [row.rts.rt];
						outPerson.result_rts = [];
						rts.forEach(function(rt,index){
							var rt_result = {};
							if(rt.dn){//<!--关联同住址成员数量大于5时,返回其中5位成员-->
								var dn = rt.dn;
								rt_result.result_dn = dn;
							}
							if(rt.rows){
								if(rt.rows.row){
									var _rows = (rt.rows.row instanceof Array) ? rt.rows.row : [rt.rows.row];
									rt_result.result_items = [];
									_rows.forEach(function(_row,index){
										var _item = {};
										if(_row.input){
											var input = _row.input;
										}
										if(_row.output){
											var output = _row.output;
											if(output.item){
												var item = output.item;
												if(item.result_xm){//<!--同住址成员的姓名-->
													_item.result_xm = item.result_xm;
												}
												if(item.result_xb){//<!--同住址成员的性别-->
													_item.result_xb = item.result_xb;
												}
												if(item.result_mz){//<!--同住址成员的民族-->
													_item.result_mz = item.result_mz;
												}
												if(item.result_csrq){//<!--同住址成员的出生日期-->
													_item.result_csrq = item.result_csrq;
												}
											}
										}
										rt_result.result_items.push(_item);
									});

								}
							}
							outPerson.result_rts.push(rt_result);
						});
					}
				}
				outPersons.push(outPerson);
			}
		});
		fn && fn(error,outPersons);
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
	var args = {
		inLicense: inLicense,
		inConditions: inConditions
	};
	soapClient.nciicCompare(args,function(err,result){
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

