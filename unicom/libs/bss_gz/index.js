/**
 * 贵州联通BSS接口
 * @type {[type]}
 */
var request = require('request');

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
	xmlmsg += '<RouteType>04</RouteType>';//** 路由类型，01手机，04区号
	xmlmsg += '<RouteValue>0851</RouteValue>';//** 路由关键值
	xmlmsg += '</Routing>';//** 路由信息节点结束
	xmlmsg += '<ProcID>ALUOP151123071351894382625439</ProcID>';//** 发起方业务流水号
	xmlmsg += '<TransIDO>ALUOP151123071351894382625439</TransIDO>';//** 发起方交易流水号
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
	xmlmsg += '<UserReq>';
	xmlmsg += '<AccProvince>85</AccProvince>';//** 省份
	xmlmsg += '<AccCity>850</AccCity>';//** 地市
	xmlmsg += '<Code>0851</Code>';//** 区号
	xmlmsg += '<NetType>02</NetType>';//** 网别，01:2G,02:3G
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
			var SvcCont = ''.match.call(body,/<SvcCont>(.*)<\/SvcCont>/);
			// console.log(SvcCont);
			if(!SvcCont) return done({errmsg: 'xml中SvcCont节点不存在'});
			var UserRsp = ''.match.call(SvcCont[1],/<UserRsp>(.*)<\/UserRsp>/) || [];
			//** 提取客户姓名
			var CustName = ''.match.call(UserRsp[1],/<CustName>(.*)<\/CustName>/) || [];
			result.CustName = CustName[1] || '';
			//** 客户状态编码
			var SubscrbStat = ''.match.call(UserRsp[1],/<SubscrbStat>(.*)<\/SubscrbStat>/) || [];
			result.SubscrbStat = SubscrbStat[1] || '';
			//** 计费类型
			var BillingType = ''.match.call(UserRsp[1],/<BillingType>(.*)<\/BillingType>/) || [];
			result.BillingType = BillingType[1] || '';
			//** 品牌标识
			var Brand = ''.match.call(UserRsp[1],/<Brand>(.*)<\/Brand>/) || [];
			result.Brand = Brand[1] || '';
			//** 城市代码
			var CityCode = ''.match.call(UserRsp[1],/<CityCode>(.*)<\/CityCode>/) || [];
			result.CityCode = CityCode[1] || '';
			//** 入网时间
			var OpenDate = ''.match.call(UserRsp[1],/<OpenDate>(.*)<\/OpenDate>/) || [];
			result.OpenDate = OpenDate[1] || '';
			//** 通话级别
			var LandLvl = ''.match.call(UserRsp[1],/<LandLvl>(.*)<\/LandLvl>/) || [];
			result.LandLvl = LandLvl[1] || '';
			//** SIM卡号
			var SimCard = ''.match.call(UserRsp[1],/<SimCard>(.*)<\/SimCard>/) || [];
			result.SimCard = SimCard[1] || '';
			//** 可用积分
			var Useintegral = ''.match.call(UserRsp[1],/<Useintegral>(.*)<\/Useintegral>/) || [];
			result.Useintegral = Useintegral[1] || '';
			//** 可用余额
			var Amount = ''.match.call(UserRsp[1],/<Amount>(.*)<\/Amount>/) || [];
			result.Amount = Amount[1] || '';
			//** VIP级别
			var VIPLev = ''.match.call(UserRsp[1],/<VIPLev>(.*)<\/VIPLev>/) || [];
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
	xmlmsg += '<OrigDomain>ECIP</OrigDomain>';//** 发起方应用域代码
	xmlmsg += '<HomeDomain>UCRM</HomeDomain>';//** 归属方应用域代码
	xmlmsg += '<BIPCode>GZWXB001</BIPCode>';//** 业务功能代码
	xmlmsg += '<BIPVer>0100</BIPVer>';//** 业务流程版本号
	xmlmsg += '<ActivityCode>GZWXT001</ActivityCode>';//** 交易代码
	xmlmsg += '<ActionCode>0</ActionCode>';//** 交易动作代码
	xmlmsg += '<ActionRelation>0</ActionRelation>';//** 交易关联性
	xmlmsg += '<Routing>';//** 路由信息节点开始
	xmlmsg += '<RouteType>01</RouteType>';//** 路由类型，01手机，04区号
	xmlmsg += '<RouteValue>18508505402</RouteValue>';//** 路由关键值
	xmlmsg += '</Routing>';//** 路由信息节点结束
	xmlmsg += '<ProcID>ALUOP151123071351894382625439</ProcID>';//** 发起方业务流水号
	xmlmsg += '<TransIDO>ALUOP151123071351894382625439</TransIDO>';//** 发起方交易流水号
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
	xmlmsg += '<BusinessType>00</BusinessType>';
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
			var SvcCont = ''.match.call(body,/<SvcCont>(.*)<\/SvcCont>/);
			console.log(SvcCont);
			if(!SvcCont) return done({errmsg: 'xml中SvcCont节点不存在'});
			var BusinessRecordRsp = ''.match.call(SvcCont[1],/<BusinessRecordRsp>(.*)<\/BusinessRecordRsp>/) || [];
			//** 提取客户姓名
			var CustName = ''.match.call(BusinessRecordRsp[1],/<CustName>(.*)<\/CustName>/) || [];
			result.CustName = CustName[1] || '';
			//** 客户状态编码
			var SubscrbStat = ''.match.call(BusinessRecordRsp[1],/<SubscrbStat>(.*)<\/SubscrbStat>/) || [];
			result.SubscrbStat = SubscrbStat[1] || '';
			//** 计费类型
			var BillingType = ''.match.call(BusinessRecordRsp[1],/<BillingType>(.*)<\/BillingType>/) || [];
			result.BillingType = BillingType[1] || '';
			//** 品牌标识
			var Brand = ''.match.call(BusinessRecordRsp[1],/<Brand>(.*)<\/Brand>/) || [];
			result.Brand = Brand[1] || '';
			//** 城市代码
			var CityCode = ''.match.call(BusinessRecordRsp[1],/<CityCode>(.*)<\/CityCode>/) || [];
			result.CityCode = CityCode[1] || '';
			//** 入网时间
			var OpenDate = ''.match.call(BusinessRecordRsp[1],/<OpenDate>(.*)<\/OpenDate>/) || [];
			result.OpenDate = OpenDate[1] || '';
			//** 通话级别
			var LandLvl = ''.match.call(BusinessRecordRsp[1],/<LandLvl>(.*)<\/LandLvl>/) || [];
			result.LandLvl = LandLvl[1] || '';
			//** SIM卡号
			var SimCard = ''.match.call(BusinessRecordRsp[1],/<SimCard>(.*)<\/SimCard>/) || [];
			result.SimCard = SimCard[1] || '';
			//** 可用积分
			var Useintegral = ''.match.call(BusinessRecordRsp[1],/<Useintegral>(.*)<\/Useintegral>/) || [];
			result.Useintegral = Useintegral[1] || '';
			//** 可用余额
			var Amount = ''.match.call(BusinessRecordRsp[1],/<Amount>(.*)<\/Amount>/) || [];
			result.Amount = Amount[1] || '';
			//** VIP级别
			var VIPLev = ''.match.call(BusinessRecordRsp[1],/<VIPLev>(.*)<\/VIPLev>/) || [];
			result.VIPLev = VIPLev[1] || '';
			
			done(err, result);
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


//** Unit Test
if(process.argv[1] == __filename){
	//** 测试 getUserInfo()
	// exports.getUserInfo({
	exports.getOrders({
		UserNumber: '18508505402',
	},function(err,result){
		if(err) return console.log(err);
		console.log(JSON.stringify(result));
	});
}