/**
 * 3.1	综合用户信息查询
 * @param  {[type]}   options [description]
 * @param  {Function} done    [description]
 * @return {[type]}           [description]
 */
var request = require('request');
var util = require('./util');

exports.getUserInfo = function(options, done) {
	var xmlmsg = '<?xml version="1.0" encoding="UTF-8"?>';
	xmlmsg = '<UniBSS>';//** 根节点开始
	xmlmsg += '<OrigDomain>ECIP</OrigDomain>';//** 发起方应用域代码
	xmlmsg += '<HomeDomain>UCRM</HomeDomain>';//** 归属方应用域代码
	xmlmsg += '<BIPCode>GZWXB001</BIPCode>';//** 业务功能代码
	xmlmsg += '<BIPVer>0100</BIPVer>';//** 业务流程版本号
	xmlmsg += '<ActivityCode>GZWXT001</ActivityCode>';//** 交易代码
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
	xmlmsg += '<UserReq>';
	xmlmsg += '<AccProvince>'+ options.AccProvince +'</AccProvince>';//** 省份
	xmlmsg += '<AccCity>'+ options.AccCity +'</AccCity>';//** 地市
	xmlmsg += '<Code>'+ options.Code +'</Code>';//** 区号
	xmlmsg += '<NetType>'+ options.NetType +'</NetType>';//** 网别，01:2G,02:3G
	xmlmsg += '<UserNumber>'+ options.UserNumber +'</UserNumber>';//**客户号码
	xmlmsg += '<Para>';
	xmlmsg += '<ParaID></ParaID>';
	xmlmsg += '<ParaValue></ParaValue>';
	xmlmsg += '</Para>';
	xmlmsg += '</UserReq>';
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
			//** 提取xml内容
			var SvcCont = ''.match.call(body,/<SvcCont>(.*)<\/SvcCont>/) || ['',''];
			console.log(SvcCont[1]);
			if(SvcCont == '') return done({errmsg: 'xml中SvcCont节点不存在'});
			var UserRsp = ''.match.call(SvcCont[1],/<UserRsp>(.*)<\/UserRsp>/) || ['',''];
			//** 提取客户姓名
			var CustName = ''.match.call(UserRsp[1],/<CustName>(.*)<\/CustName>/) || ['',''];
			result.CustName = CustName[1] || '';
			//** 客户状态编码
			var SubscrbStat = ''.match.call(UserRsp[1],/<SubscrbStat>(.*)<\/SubscrbStat>/) || ['',''];
			result.SubscrbStat = SubscrbStat[1] || '';
			//** 计费类型
			var BillingType = ''.match.call(UserRsp[1],/<BillingType>(.*)<\/BillingType>/) || ['',''];
			result.BillingType = BillingType[1] || '';
			//** 品牌标识
			var Brand = ''.match.call(UserRsp[1],/<Brand>(.*)<\/Brand>/) || ['',''];
			result.Brand = Brand[1] || '';
			//** 城市代码
			var CityCode = ''.match.call(UserRsp[1],/<CityCode>(.*)<\/CityCode>/) || ['',''];
			result.CityCode = CityCode[1] || '';
			//** 入网时间
			var OpenDate = ''.match.call(UserRsp[1],/<OpenDate>(.*)<\/OpenDate>/) || ['',''];
			result.OpenDate = OpenDate[1] || '';
			//** 通话级别
			var LandLvl = ''.match.call(UserRsp[1],/<LandLvl>(.*)<\/LandLvl>/) || ['',''];
			result.LandLvl = LandLvl[1] || '';
			//** SIM卡号
			var SimCard = ''.match.call(UserRsp[1],/<SimCard>(.*)<\/SimCard>/) || ['',''];
			result.SimCard = SimCard[1] || '';
			//** 可用积分
			var Useintegral = ''.match.call(UserRsp[1],/<Useintegral>(.*)<\/Useintegral>/) || ['',''];
			result.Useintegral = Useintegral[1] || '';
			//** 可用余额
			var Amount = ''.match.call(UserRsp[1],/<Amount>(.*)<\/Amount>/) || ['',''];
			result.Amount = Amount[1] || '';
			//** VIP级别
			var VIPLev = ''.match.call(UserRsp[1],/<VIPLev>(.*)<\/VIPLev>/) || ['',''];
			result.VIPLev = VIPLev[1] || '';
			
			done(err, result);
		}
	);
};

module.exports = exports;