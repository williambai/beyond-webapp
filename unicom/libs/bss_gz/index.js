/**
 * 贵州联通BSS接口
 * @type {[type]}
 */
var request = require('request');
var xml2js = require('xml2js');
var _ = require('underscore');

/**
 * 3.1	综合用户信息查询
 * @param  {[type]}   options [description]
 * @param  {Function} done    [description]
 * @return {[type]}           [description]
 */
exports.getUserInfo = function(options, done) {
	var xmlmsg = '<?xml version="1.0" encoding="UTF-8"?>';
	xmlmsg = '<UniBSS>';
	xmlmsg += '<OrigDomain>ECIP</OrigDomain>';
	xmlmsg += '<HomeDomain>UCRM</HomeDomain>';
	xmlmsg += '<BIPCode>GZWXB001</BIPCode>';
	xmlmsg += '<BIPVer>0100</BIPVer>';
	xmlmsg += '<ActivityCode>GZWXT001</ActivityCode>';
	xmlmsg += '<ActionCode>0</ActionCode>';
	xmlmsg += '<ActionRelation>0</ActionRelation>';
	xmlmsg += '<Routing>';
	xmlmsg += '<RouteType>04</RouteType>';
	xmlmsg += '<RouteValue>0851</RouteValue>';
	xmlmsg += '</Routing>';
	xmlmsg += '<ProcID>ALUOP151123071351894382625439</ProcID>';
	xmlmsg += '<TransIDO>ALUOP151123071351894382625439</TransIDO>';
	xmlmsg += '<ProcessTime>20151123071351</ProcessTime>';
	xmlmsg += '<SPReserve>';
	xmlmsg += '<TransIDC>201511230713519248570101408111</TransIDC>';
	xmlmsg += '<CutOffDay>20151123</CutOffDay>';
	xmlmsg += '<OSNDUNS>0002</OSNDUNS>';
	xmlmsg += '<HSNDUNS>8500</HSNDUNS>';
	xmlmsg += '<ConvID></ConvID>';
	xmlmsg += '</SPReserve>';
	xmlmsg += '<TestFlag>0</TestFlag>';
	xmlmsg += '<MsgSender>9801</MsgSender>';
	xmlmsg += '<MsgReceiver>9800</MsgReceiver>';
	xmlmsg += '<SvcContVer>0100</SvcContVer>';
	xmlmsg += '<SvcCont>';
	xmlmsg += '<![CDATA[';
	xmlmsg += '<?xml version="1.0" encoding="UTF-8"?>';
	xmlmsg += '<UserReq>';
	xmlmsg += '<AccProvince>85</AccProvince>';
	xmlmsg += '<AccCity>850</AccCity>';
	xmlmsg += '<Code>0851</Code>';
	xmlmsg += '<NetType>03</NetType>';
	xmlmsg += '<UserNumber>18508505402</UserNumber>';
	xmlmsg += '<Para>';
	xmlmsg += '<ParaID></ParaID>';
	xmlmsg += '<ParaValue></ParaValue>';
	xmlmsg += '</Para>';
	xmlmsg += '</UserReq>';
	xmlmsg += ']]>';
	xmlmsg += '</SvcCont>';
	xmlmsg += '</UniBSS>';

	request({
			url: options.url || 'http://130.85.50.34:7772/XMLReceiver',
			method: 'POST',
			headers: {
				'Accept': 'application/xml',
				'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko',
				'Connection': 'Keep-Alive',
			},
			form: {
				xmlmsg: xmlmsg,
			}
		},
		function(err, httpResponse, body) {
			if (err) return done(err);
			console.log(body);
			//** xml转json
			xml2js.parseString(body, function(err, result) {
				done(err, result);
			});
		}
	);
};

/**
 * 3.6	业务开通
 * @param {[type]}   options [description]
 * @param {Function} done    [description]
 */
exports.addOrder = function(options, done) {
	var xmlmsg = '';
	xmlmsg = '<UniBSS>';
	xmlmsg += '<OrigDomain>ECIP</OrigDomain>';
	xmlmsg += '<HomeDomain>UCRM</HomeDomain>';
	xmlmsg += '<BIPCode>GZWXB001</BIPCode>';
	xmlmsg += '<BIPVer>0100</BIPVer>';
	xmlmsg += '<ActivityCode>GZWXT001</ActivityCode>';
	xmlmsg += '<ActionCode>0</ActionCode>';
	xmlmsg += '<ActionRelation>0</ActionRelation>';
	xmlmsg += '<Routing>';
	xmlmsg += '<RouteType>04</RouteType>';
	xmlmsg += '<RouteValue>0851</RouteValue>';
	xmlmsg += '</Routing>';
	xmlmsg += '<ProcID>ALUOP151123071351894382625439</ProcID>';
	xmlmsg += '<TransIDO>ALUOP151123071351894382625439</TransIDO>';
	xmlmsg += '<ProcessTime>20151123071351</ProcessTime>';
	xmlmsg += '<SPReserve>';
	xmlmsg += '<TransIDC>201511230713519248570101408111</TransIDC>';
	xmlmsg += '<CutOffDay>20151123</CutOffDay>';
	xmlmsg += '<OSNDUNS>0002</OSNDUNS>';
	xmlmsg += '<HSNDUNS>8500</HSNDUNS>';
	xmlmsg += '<ConvID></ConvID>';
	xmlmsg += '</SPReserve>';
	xmlmsg += '<TestFlag>0</TestFlag>';
	xmlmsg += '<MsgSender>9801</MsgSender>';
	xmlmsg += '<MsgReceiver>9800</MsgReceiver>';
	xmlmsg += '<SvcContVer>0100</SvcContVer>';
	xmlmsg += '<SvcCont>';
	xmlmsg += '<![CDATA[';
	xmlmsg += '<?xml version="1.0" encoding="UTF-8"?>';
	xmlmsg += '<PackageChangeReq>';
	xmlmsg += '<Para1></Para1>';
	xmlmsg += '<Para2></Para2>';
	xmlmsg += '<ProdcutId>99013000</ProdcutId>';
	xmlmsg += '<ProductType>1</ProductType>';
	xmlmsg += '<OperCode>0</OperCode>'; //** 0 开通业务
	xmlmsg += '<StaffID></StaffID>';
	xmlmsg += '<DepartID></DepartID>';
	xmlmsg += '<ProcTime>20151123121300059</ProcTime>';
	xmlmsg += '<UserNumber>18508505402</UserNumber>';
	xmlmsg += '</PackageChangeReq>';
	xmlmsg += ']]>';
	xmlmsg += '</SvcCont>';
	xmlmsg += '</UniBSS>';

	request({
			url: options.url || 'http://130.85.50.34:7772/XMLReceiver',
			method: 'POST',
			headers: {
				'Accept': 'application/xml',
				'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko',
				'Connection': 'Keep-Alive',
			},
			form: {
				xmlmsg: xmlmsg,
			}
		},
		function(err, httpResponse, body) {
			if (err) return done(err);
			console.log(body);
			done(null, body);
		}
	);
};

/**
 * 3.6	业务取消
 * @param  {[type]}   options [description]
 * @param  {Function} done    [description]
 * @return {[type]}           [description]
 */
exports.removeOrder = function(options, done) {
	var xmlmsg = '';
	xmlmsg = '<UniBSS>';
	xmlmsg += '<OrigDomain>ECIP</OrigDomain>';
	xmlmsg += '<HomeDomain>UCRM</HomeDomain>';
	xmlmsg += '<BIPCode>GZWXB001</BIPCode>';
	xmlmsg += '<BIPVer>0100</BIPVer>';
	xmlmsg += '<ActivityCode>GZWXT001</ActivityCode>';
	xmlmsg += '<ActionCode>0</ActionCode>';
	xmlmsg += '<ActionRelation>0</ActionRelation>';
	xmlmsg += '<Routing>';
	xmlmsg += '<RouteType>04</RouteType>';
	xmlmsg += '<RouteValue>0851</RouteValue>';
	xmlmsg += '</Routing>';
	xmlmsg += '<ProcID>ALUOP151123071351894382625439</ProcID>';
	xmlmsg += '<TransIDO>ALUOP151123071351894382625439</TransIDO>';
	xmlmsg += '<ProcessTime>20151123071351</ProcessTime>';
	xmlmsg += '<SPReserve>';
	xmlmsg += '<TransIDC>201511230713519248570101408111</TransIDC>';
	xmlmsg += '<CutOffDay>20151123</CutOffDay>';
	xmlmsg += '<OSNDUNS>0002</OSNDUNS>';
	xmlmsg += '<HSNDUNS>8500</HSNDUNS>';
	xmlmsg += '<ConvID></ConvID>';
	xmlmsg += '</SPReserve>';
	xmlmsg += '<TestFlag>0</TestFlag>';
	xmlmsg += '<MsgSender>9801</MsgSender>';
	xmlmsg += '<MsgReceiver>9800</MsgReceiver>';
	xmlmsg += '<SvcContVer>0100</SvcContVer>';
	xmlmsg += '<SvcCont>';
	xmlmsg += '<![CDATA[';
	xmlmsg += '<?xml version="1.0" encoding="UTF-8"?>';
	xmlmsg += '<PackageChangeReq>';
	xmlmsg += '<Para1></Para1>';
	xmlmsg += '<Para2></Para2>';
	xmlmsg += '<ProdcutId>99013000</ProdcutId>';
	xmlmsg += '<ProductType>1</ProductType>';
	xmlmsg += '<OperCode>1</OperCode>'; //** 1 取消业务
	xmlmsg += '<StaffID></StaffID>';
	xmlmsg += '<DepartID></DepartID>';
	xmlmsg += '<ProcTime>20151123121300059</ProcTime>';
	xmlmsg += '<UserNumber>18508505402</UserNumber>';
	xmlmsg += '</PackageChangeReq>';
	xmlmsg += ']]>';
	xmlmsg += '</SvcCont>';
	xmlmsg += '</UniBSS>';

	request({
			url: options.url || 'http://130.85.50.34:7772/XMLReceiver',
			method: 'POST',
			headers: {
				'Accept': 'application/xml',
				'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko',
				'Connection': 'Keep-Alive',
			},
			form: {
				xmlmsg: xmlmsg,
			}
		},
		function(err, httpResponse, body) {
			if (err) return done(err);
			console.log(body);
			done(null, body);
		}
	);
};

module.exports = exports;