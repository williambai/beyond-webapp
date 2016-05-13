/**
 * 贵州联通BSS接口
 * @type {[type]}
 */
var request = require('request');

/**
 * 格式化显示日期时间
 * 参数x : 待显示的日期时间，示例： new Date()
 * 参数y: 需要显示的格式，示例：yyyy-MM-dd hh:mm:ss
 */
function date2str(x, y) {
   var z = {
      y: x.getFullYear(),
      M: x.getMonth() + 1,
      d: x.getDate(),
      h: x.getHours(),
      m: x.getMinutes(),
      s: x.getSeconds()
   };
   return y.replace(/(y+|M+|d+|h+|m+|s+)/g, function(v) {
      return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-(v.length > 2 ? v.length : 2));
   });
};

/**
 * 3.1	综合用户信息查询
 * @param  {[type]}   options [description]
 * @param  {Function} done    [description]
 * @return {[type]}           [description]
 */
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
	xmlmsg += '<ProcessTime>' + date2str(new Date(), 'yyyyMMddhhmmss') + '</ProcessTime>';//** 处理时间
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

/**
 * 3.2	用户已订购业务查询
 * @param  {[type]}   options [description]
 * @param  {Function} done    [description]
 * @return {[type]}           [description]
 */
exports.getOrders = function(options,done){
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
			var BusinessRecordRsp = ''.match.call(SvcCont[1],/<BusinessRecordRsp>(.*)<\/BusinessRecordRsp>/) || ['',''];
			//** 提取返回编码
			var ResultCode = ''.match.call(BusinessRecordRsp[1],/<ResultCode>(.*)<\/ResultCode>/) || ['',''];
			result.ResultCode = ResultCode[1] || '';
			//** 返回描述
			var ResultDESC = ''.match.call(BusinessRecordRsp[1],/<ResultDESC>(.*)<\/ResultDESC>/) || ['',''];
			result.ResultDESC = ResultDESC[1] || '';
			//** 业务记录集合
			var BusinessRecordList = ''.match.call(BusinessRecordRsp[1],/<BusinessRecordList>(.*)<\/BusinessRecordList>/) || ['',''];
			result.BusinessRecordList = BusinessRecordList[1] || '';

			done(err, result);
		}
	);
};

/**
 * 4.12	产品(套餐)变更
 * @param {[type]}   options [description]
 * @param {Function} done    [description]
 */
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
	xmlmsg += '<ProcessTime>'+ date2str(new Date(),'yyyyMMddhhmmss') +'</ProcessTime>';
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
	xmlmsg += '<ProcTime>'+ date2str(new Date(), 'yyyyMMddhhmmss') +'</ProcTime>';
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
			var PackageChangeRsp = ''.match.call(SvcCont[1],/<PackageChangeRsp>(.*)<\/PackageChangeRsp>/) || ['',''];
			//** 提取返回编码
			var RespCode = ''.match.call(PackageChangeRsp[1],/<RespCode>(.*)<\/RespCode>/) || ['',''];
			result.RespCode = RespCode[1] || '';
			//** 返回描述
			var RespDesc = ''.match.call(PackageChangeRsp[1],/<RespDesc>(.*)<\/RespDesc>/) || ['',''];
			result.RespDesc = RespDesc[1] || '';
			//** 返回生效时间
			var EffectTime = ''.match.call(PackageChangeRsp[1],/<EffectTime>(.*)<\/EffectTime>/) || ['',''];
			result.EffectTime = EffectTime[1] || '';
			done(err, result);
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
	xmlmsg += '<ProcessTime>'+ date2str(new Date(),'yyyyMMddhhmmss') +'</ProcessTime>';
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
	xmlmsg += '<OperCode>1</OperCode>'; //** 1 取消业务
	xmlmsg += '<ProcTime>'+ date2str(new Date(), 'yyyyMMddhhmmss') +'</ProcTime>';
	xmlmsg += '<StaffId>'+ options.StaffID +'</StaffId>';
	xmlmsg += '<DepartId>'+ options.DepartID+'</DepartId>';
	xmlmsg += '<Para1></Para1>';
	xmlmsg += '<Para2></Para2>';
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
			var PackageChangeRsp = ''.match.call(SvcCont[1],/<PackageChangeRsp>(.*)<\/PackageChangeRsp>/) || ['',''];
			//** 提取返回编码
			var RespCode = ''.match.call(PackageChangeRsp[1],/<RespCode>(.*)<\/RespCode>/) || ['',''];
			result.RespCode = RespCode[1] || '';
			//** 返回描述
			var RespDesc = ''.match.call(PackageChangeRsp[1],/<RespDesc>(.*)<\/RespDesc>/) || ['',''];
			result.RespDesc = RespDesc[1] || '';
			//** 返回生效时间
			var EffectTime = ''.match.call(PackageChangeRsp[1],/<EffectTime>(.*)<\/EffectTime>/) || ['',''];
			result.EffectTime = EffectTime[1] || '';
			done(err, result);
		}
	);
};

module.exports = exports;


//** Unit Test
if(process.argv[1] == __filename){
	//** 测试 getUserInfo()
	// exports.getUserInfo({
	// 	url: 'http://130.85.50.34:7772/XMLReceiver',
	// 	requestId: 'ALUOP151123071351894382625439' + parseInt(Math.random()*10000),
	// 	AccProvince: '85',
	// 	AccCity: '850',
	// 	Code: '0851',
	// 	NetType: '02',
	// 	UserNumber: '15692740700',
	// },function(err,result){
	// 	if(err) return console.log(err);
	// 	console.log(JSON.stringify(result));
	// });

	//** 测试 getOrders()
	// exports.getOrders({
	// 	url: 'http://130.85.50.34:7772/XMLReceiver',
	// 	requestId: 'ALUOP151123071351894382625439' + parseInt(Math.random()*10000),
	// 	BusinessType: '00',
	// 	UserNumber: '15692740700',
	// },function(err,result){
	// 	if(err) return console.log(err);
	// 	console.log(JSON.stringify(result));
	// });

	//** 测试 addOrder()
	exports.addOrder({
		url: 'http://130.85.50.34:7772/XMLReceiver',
		requestId: 'seq00001' + parseInt(Math.random()*10000),
		ProductId: '9085037900',
		StaffID: 'SUPERUSR',
		DepartID: 'Z0851',
		UserNumber: '15692740700',
	},function(err,result){
		if(err) return console.log(err);
		console.log(JSON.stringify(result));
	});

	//** 测试 removeOrder()
	// exports.removeOrder({
	// 	url: 'http://130.85.50.34:7772/XMLReceiver',
	// 	requestId: 'seq00001' + parseInt(Math.random()*10000),
	// 	ProductId: '99013000',
	// 	ProductType: '1',
	// 	StaffID: 'SUPERUSR',
	// 	DepartID: 'Z0851',
	// 	UserNumber: '15692740700',
	// },function(err,result){
	// 	if(err) return console.log(err);
	// 	console.log(JSON.stringify(result));
	// });

}