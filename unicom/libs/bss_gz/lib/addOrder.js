/**
 * 4.12	产品(套餐)变更
 * 
 * 业务开通
 * 
 * @param {[type]}   options [description]
 * @param {Function} done    [description]
 */
var request = require('request');
var util = require('./util');

exports.addOrder = function(options, done) {
	var xmlmsg = '';
	xmlmsg = '<UniBSS>';
	xmlmsg += '<OrigDomain>ECIP</OrigDomain>';
	xmlmsg += '<HomeDomain>UCRM</HomeDomain>';
	xmlmsg += '<BIPCode>GZSFB002</BIPCode>';//** 业务代码
	xmlmsg += '<BIPVer>0100</BIPVer>';
	xmlmsg += '<ActivityCode>GZSFT002</ActivityCode>';//** 交易代码
	xmlmsg += '<ActionCode>0</ActionCode>';
	xmlmsg += '<ActionRelation>0</ActionRelation>';
	xmlmsg += '<Routing>';
	xmlmsg += '<RouteType>01</RouteType>';
	xmlmsg += '<RouteValue>'+ options.UserNumber +'</RouteValue>';
	xmlmsg += '</Routing>';
	xmlmsg += '<ProcID>'+ options.requestId +'</ProcID>';
	xmlmsg += '<TransIDO>'+ options.requestId +'</TransIDO>';
	xmlmsg += '<ProcessTime>'+ util.date2str(new Date(),'yyyyMMddhhmmss') +'</ProcessTime>';
	xmlmsg += '<SPReserve>';
	xmlmsg += '<TransIDC>201511230713519248570101408111</TransIDC>';
	xmlmsg += '<CutOffDay>20151123</CutOffDay>';
	xmlmsg += '<OSNDUNS>0002</OSNDUNS>';
	xmlmsg += '<HSNDUNS>1100</HSNDUNS>';
	xmlmsg += '<ConvID></ConvID>';
	xmlmsg += '</SPReserve>';
	xmlmsg += '<TestFlag>0</TestFlag>';
	xmlmsg += '<MsgSender>1101</MsgSender>';
	xmlmsg += '<MsgReceiver>1100</MsgReceiver>';
	xmlmsg += '<SvcContVer>0100</SvcContVer>';
	xmlmsg += '<SvcCont>';
	xmlmsg += '<![CDATA[';
	xmlmsg += '<?xml version="1.0" encoding="UTF-8"?>';
	xmlmsg += '<PackageChangeReq>';
	xmlmsg += '<UserNumber>'+ options.UserNumber +'</UserNumber>';
	xmlmsg += '<PackageCode>'+ options.ProductId +'</PackageCode>';
	xmlmsg += '<OperCode>0</OperCode>'; //** 0 开通业务
	xmlmsg += '<ProcTime>'+ util.date2str(new Date(), 'yyyyMMddhhmmss') +'</ProcTime>';
	xmlmsg += '<StaffId>'+ options.StaffID +'</StaffId>';
	xmlmsg += '<DepartId>'+ options.DepartID+'</DepartId>';
	xmlmsg += '<Para1></Para1>';
	xmlmsg += '<Para2></Para2>';
	xmlmsg += '</PackageChangeReq>';
	xmlmsg += ']]>';
	xmlmsg += '</SvcCont>';
	xmlmsg += '</UniBSS>';

	console.log('xmlmsg=' + xmlmsg);
	request({
			url: options.url,
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
			try{
				body = decodeURIComponent(body).replace(/\n/g,'');
			}catch(e){
				console.log(body);
				return done({errmsg: '服务器错误。返回的格式不对，xml解析错误'});
			}

			//** 判断返回的是xml文件
			if(!/^<\?xml.*>$/.test(body)) return done({errmsg: '服务器错误。返回的格式不对，xml解析错误'});

			var result = {};
			//** 客户号码
			result.UserNumber = options.UserNumber || '';

			//** SvcCont 节点
			var SvcCont = body.match(/<SvcCont>.*<\/SvcCont>/);
			if(SvcCont == null) return done({errmsg: 'xml中SvcCont节点不存在'});
			// console.log('SvcCont 节点内容：' + SvcCont[0]);

			//** PackageChangeRsp 节点
			var PackageChangeRsp = (SvcCont[0].match(/<PackageChangeRsp>.*?<\/PackageChangeRsp>/) || [''])[0];
			var RespCode = PackageChangeRsp.match(/<RespCode>(.*?)<\/RespCode>/) || [];
			result.RespCode = RespCode[1] || '8888';
			var RespDesc = PackageChangeRsp.match(/<RespDesc>(.*?)<\/RespDesc>/) || [];
			result.RespDesc = RespDesc[1] || '';
			var EffectTime = PackageChangeRsp.match(/<EffectTime>(.*?)<\/EffectTime>/) || [];
			result.EffectTime = EffectTime[1] || '';

			done(err, result);
		}
	);
};

module.exports = exports;