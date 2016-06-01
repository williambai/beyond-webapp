/**
 * 4.5	流量查询
 * 
 * 用户通过电子渠道短信和网上营业厅查询手机上网流量使用情况或3G后付费上网卡流量情况。
 *
 * 返回 RespCode 节点含义：
 * 0000：成功
 * 0001：非联通用户
 * 0002：用户不存在
 * 0003：用户欠费
 * 0004：黑名单用户
 * 0005：用户资信等级不够
 * 0010：无该业务类型
 * 0011：不支持该业务
 * 0012：用户不能使用该业务
 * 0013：用户状态不正确
 * 9999：系统故障
 * 其他错误情况：2位业务类型+2位错误码（可扩展）
 * 0201：用户非3G后付费上网卡用户
 * 
 * 8888 xml没有这个节点(自定义的)
 */
var request = require('request');
var util = require('./util');

module.exports = exports = function(options, done) {
	var xmlmsg = '<?xml version="1.0" encoding="UTF-8"?>';
	xmlmsg = '<UniBSS>';//** 根节点开始
	xmlmsg += '<OrigDomain>ECIP</OrigDomain>';//** 发起方应用域代码
	xmlmsg += '<HomeDomain>UCRM</HomeDomain>';//** 归属方应用域代码
	xmlmsg += '<BIPCode>GZWXB001</BIPCode>';//** 业务功能代码
	xmlmsg += '<BIPVer>0100</BIPVer>';//** 业务流程版本号
	xmlmsg += '<ActivityCode>GZWXT004</ActivityCode>';//** 交易代码
	xmlmsg += '<ActionCode>0</ActionCode>';//** 交易动作代码
	xmlmsg += '<ActionRelation>0</ActionRelation>';//** 交易关联性
	xmlmsg += '<Routing>';//** 路由信息节点开始
	xmlmsg += '<RouteType>01</RouteType>';//** 路由类型，01手机，04区号
	xmlmsg += '<RouteValue>'+ options.UserNumber +'</RouteValue>';//** 路由关键值
	xmlmsg += '</Routing>';//** 路由信息节点结束
	xmlmsg += '<ProcID>'+ options.requestId + '</ProcID>';//** 发起方业务流水号
	xmlmsg += '<TransIDO>'+ options.requestId +'</TransIDO>';//** 发起方交易流水号
	xmlmsg += '<ProcessTime>' + util.date2str(new Date(), 'yyyyMMddhhmmss') + '</ProcessTime>';//** 处理时间
	xmlmsg += '<SPReserve>';//** 一级枢纽保留信息节点开始
	xmlmsg += '<TransIDC>201511230713519248570101408111</TransIDC>';//** 一级枢纽交易流水号
	xmlmsg += '<CutOffDay>20151123</CutOffDay>';//** 逻辑交易日
	xmlmsg += '<OSNDUNS>0002</OSNDUNS>';//** 发起方交互节点代码
	xmlmsg += '<HSNDUNS>8500</HSNDUNS>';//** 归属方交换节点代码
	xmlmsg += '<ConvID></ConvID>';//** 交换中心处理标识
	xmlmsg += '</SPReserve>';//** 一级枢纽保留信息节点结束
	xmlmsg += '<TestFlag>0</TestFlag>'; //** 测试标记, 0：非测试交易，1：测试交易
	xmlmsg += '<MsgSender>9801</MsgSender>';//** 消息发送方代码
	xmlmsg += '<MsgReceiver>9800</MsgReceiver>';//** 消息直接接收方代码
	xmlmsg += '<SvcContVer>0100</SvcContVer>';//** 业务内容报文的版本号
	xmlmsg += '<SvcCont>';//** 请求/应答内容节点开始
	xmlmsg += '<![CDATA[';
	xmlmsg += '<?xml version="1.0" encoding="UTF-8"?>';
	xmlmsg += '<FlowSearchReq>';
	xmlmsg += '<UserNumber>'+ options.UserNumber +'</UserNumber>';//**客户号码
	xmlmsg += '<BizType>01</BizType>';//**业务类型（可扩展）01：手机上网流量 02：3G后付费上网卡短信提醒
	xmlmsg += '<Para>';
	xmlmsg += '<ParaID></ParaID>';
	xmlmsg += '<ParaValue></ParaValue>';
	xmlmsg += '</Para>';
	xmlmsg += '</FlowSearchReq>';
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
				body = decodeURIComponent(body).replace(/(\r|\n)/g,'');
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

			//** FlowSearchRsp 节点
			var FlowSearchRsp = (SvcCont[0].match(/<FlowSearchRsp>.*?<\/FlowSearchRsp>/) || [''])[0];
			var RespCode = FlowSearchRsp.match(/<RespCode>(.*?)<\/RespCode>/) || [];
			result.RespCode = RespCode[1] || '8888';
			var RespDesc = FlowSearchRsp.match(/<RespDesc>(.*?)<\/RespDesc>/) || [];
			result.RespDesc = RespDesc[1] || '';
			var FlowInfs = FlowSearchRsp.match(/<FlowInf>.*?<\/FlowInf>/g) || [];
			result.FlowInf = [];

			//** FlowInf 节点集
			FlowInfs.forEach(function(FlowInf){
				var obj = {};
				//** FlowInf 节点
				var TotalFlow = FlowInf.match(/<TotalFlow>(.*?)<\/TotalFlow>/) || [];
				obj['TotalFlow'] = TotalFlow[1] || '';
				var ChargedFlow = FlowInf.match(/<ChargedFlow>(.*?)<\/ChargedFlow>/) || [];
				obj['ChargedFlow'] = ChargedFlow[1] || '';
				var PackageExceedFlag = FlowInf.match(/<PackageExceedFlag>(.*?)<\/PackageExceedFlag>/) || [];
				obj['PackageExceedFlag'] = PackageExceedFlag[1] || '';
				var PackageUsedFlow = FlowInf.match(/<PackageUsedFlow>(.*?)<\/PackageUsedFlow>/) || [];
				obj['PackageUsedFlow'] = PackageUsedFlow[1] || '';
				var PackageLeavingsFlow = FlowInf.match(/<PackageLeavingsFlow>(.*?)<\/PackageLeavingsFlow>/) || [];
				obj['PackageLeavingsFlow'] = PackageLeavingsFlow[1] || '';
				var InheritExceedFlag = FlowInf.match(/<InheritExceedFlag>(.*?)<\/InheritExceedFlag>/) || [];
				obj['InheritExceedFlag'] = InheritExceedFlag[1] || '';
				var InheritUsedFlow = FlowInf.match(/<InheritUsedFlow>(.*?)<\/InheritUsedFlow>/) || [];
				obj['InheritUsedFlow'] = InheritUsedFlow[1] || '';
				var InheritLeavingsFlow = FlowInf.match(/<InheritLeavingsFlow>(.*?)<\/InheritLeavingsFlow>/) || [];
				obj['InheritLeavingsFlow'] = InheritLeavingsFlow[1] || '';
				var Para1 = FlowInf.match(/<Para1>(.*?)<\/Para1>/) || [];
				obj['Para1'] = Para1[1] || '';
				var Para2 = FlowInf.match(/<Para2>(.*?)<\/Para2>/) || [];
				obj['Para2'] = Para2[1] || '';
				result.FlowInf.push(obj);
			});

			done(err, result);
		}
	);
};

