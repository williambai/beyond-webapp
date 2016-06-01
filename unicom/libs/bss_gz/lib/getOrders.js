/**
 * 4.2	用户已订购业务查询
 * @param  {[type]}   options [description]
 * @param  {Function} done    [description]
 * @return {[type]}           [description]
 */
var request = require('request');
var util = require('./util');

module.exports = exports = function(options,done){
	xmlmsg = '<UniBSS>';//** 根节点开始
	xmlmsg += '<OrigDomain>GZKF</OrigDomain>';//** 发起方应用域代码
	xmlmsg += '<HomeDomain>UCRM</HomeDomain>';//** 归属方应用域代码
	xmlmsg += '<BIPCode>GZWXB001</BIPCode>';//** 业务功能代码
	xmlmsg += '<BIPVer>0100</BIPVer>';//** 业务流程版本号
	xmlmsg += '<ActivityCode>GZWXT002</ActivityCode>';//** 交易代码
	xmlmsg += '<ActionCode>0</ActionCode>';//** 交易动作代码
	xmlmsg += '<ActionRelation>0</ActionRelation>';//** 交易关联性
	xmlmsg += '<Routing>';//** 路由信息节点开始
	xmlmsg += '<RouteType>01</RouteType>';//** 路由类型，01手机，04区号
	xmlmsg += '<RouteValue>'+ options.UserNumber +'</RouteValue>';//** 路由关键值
	xmlmsg += '</Routing>';//** 路由信息节点结束
	xmlmsg += '<ProcID>'+ options.requestId +'</ProcID>';//** 发起方业务流水号
	xmlmsg += '<TransIDO>'+ options.requestId +'</TransIDO>';//** 发起方交易流水号
	xmlmsg += '<ProcessTime>20151123071351</ProcessTime>';//** 处理时间
	xmlmsg += '<SPReserve>';//** 一级枢纽保留信息节点开始
	xmlmsg += '<TransIDC>201511230713519248570101408111</TransIDC>';//** 一级枢纽交易流水号
	xmlmsg += '<CutOffDay>20151123</CutOffDay>';//** 逻辑交易日
	xmlmsg += '<OSNDUNS>0002</OSNDUNS>';//** 发起方交互节点代码
	xmlmsg += '<HSNDUNS>8500</HSNDUNS>';//** 归属方交换节点代码
	xmlmsg += '<ConvID></ConvID>';//** 交换中心处理标识
	xmlmsg += '</SPReserve>';//** 一级枢纽保留信息节点结束
	xmlmsg += '<TestFlag>0</TestFlag>'; //** 测试标记
	xmlmsg += '<MsgSender>9801</MsgSender>';//** 消息发送方代码
	xmlmsg += '<MsgReceiver>9800</MsgReceiver>';//** 消息直接接收方代码
	xmlmsg += '<SvcContVer>0100</SvcContVer>';//** 业务内容报文的版本号
	xmlmsg += '<SvcCont>';//** 请求/应答内容节点开始
	xmlmsg += '<![CDATA[';
	xmlmsg += '<?xml version="1.0" encoding="UTF-8"?>';
	xmlmsg += '<BusinessRecordReq>';
	xmlmsg += '<UserNumber>'+ options.UserNumber + '</UserNumber>';
	xmlmsg += '<BusinessType>'+ options.BusinessType +'</BusinessType>';
	xmlmsg += '</BusinessRecordReq>';
	xmlmsg += ']]>';
	xmlmsg += '</SvcCont>';//** 请求/应答内容节点结束
	xmlmsg += '</UniBSS>';//** 根节点结束
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
			console.log('SvcCont 节点内容：' + SvcCont[0]);

			//** BusinessRecordRsp 节点
			var BusinessRecordRsp = (SvcCont[0].match(/<BusinessRecordRsp>.*?<\/BusinessRecordRsp>/) || [''])[0];
			var ResultCode = BusinessRecordRsp.match(/<ResultCode>(.*?)<\/ResultCode>/) || [];
			result.ResultCode = ResultCode[1] || '8888';
			var ResultDESC = BusinessRecordRsp.match(/<ResultDESC>(.*?)<\/ResultDESC>/) || [];
			result.ResultDESC = ResultDESC[1] || '';
			var BusinessRecordLists = BusinessRecordRsp.match(/<BusinessRecordList>.*?<\/BusinessRecordList>/g) || [];
			result.BusinessRecordList = [];

			//** BusinessRecordList 节点集
			BusinessRecordLists.forEach(function(BusinessRecordList){
				var obj = {};
				//** BusinessRecordList 节点
				var ProductID = BusinessRecordList.match(/<ProductID>(.*?)<\/ProductID>/) || [];
				obj['ProductID'] = ProductID[1] || '';
				var ProductName = BusinessRecordList.match(/<ProductName>(.*?)<\/ProductName>/) || [];
				obj['ProductName'] = ProductName[1] || '';
				var BrandName = BusinessRecordList.match(/<BrandName>(.*?)<\/BrandName>/) || [];
				obj['BrandName'] = BrandName[1] || '';
				var ProductExplain = BusinessRecordList.match(/<ProductExplain>(.*?)<\/ProductExplain>/) || [];
				obj['ProductExplain'] = ProductExplain[1] || '';
				var StartTime = BusinessRecordList.match(/<StartTime>(.*?)<\/StartTime>/) || [];
				obj['StartTime'] = StartTime[1] || '';
				var EndTime = BusinessRecordList.match(/<EndTime>(.*?)<\/EndTime>/) || [];
				obj['EndTime'] = EndTime[1] || '';
				result.BusinessRecordList.push(obj);
			});

			done(err, result);
		}
	);
};
