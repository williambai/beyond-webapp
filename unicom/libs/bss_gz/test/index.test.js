var expect = require('expect.js');
var bss = require('../index');

describe('BSS 功能：', function() {
	it('.getUserInfo()', function(done) {
		bss.getUserInfo({},function(err,result){
			console.log(err)
			done();
		});
	});
	it('.addOrder() && .removeOrder()', function(done) {
		bss.addOrder({},function(err,result){
			console.log(err)
			xit('.removeOrder()', function(done) {
				bss.removeOrder({},function(err,result){
					console.log(err)
					done();
				});
			});	
		});
	});
	xit('.removeOrder()', function(done) {
		bss.removeOrder({},function(err,result){
			console.log(err)
			done();
		});
	});	
});


/**
返回body:

%3C%3Fxml+version%3D%221.0%22+encoding%3D%22UTF-8%22%3F%3E%0A%3CUniBSS%3E%0A++++%3COrigDomain%3EECIP%3C%2FOrigDomain%3E%0A++++%3CHomeDomain%3EUCRM%3C%2FHomeDomain%3E%0A++++%3CBIPCode%3EGZWXB001%3C%2FBIPCode%3E%0A++++%3CBIPVer%3E0100%3C%2FBIPVer%3E%0A++++%3CActivityCode%3EGZWXT001%3C%2FActivityCode%3E%0A++++%3CActionCode%3E1%3C%2FActionCode%3E%0A++++%3CActionRelation%3E0%3C%2FActionRelation%3E%0A++++%3CRouting%3E%0A++++++++%3CRouteType%3E04%3C%2FRouteType%3E%0A++++++++%3CRouteValue%3E0851%3C%2FRouteValue%3E%0A++++%3C%2FRouting%3E%0A++++%3CProcID%3EALUOP151123071351894382625439%3C%2FProcID%3E%0A++++%3CTransIDO%3EALUOP151123071351894382625439%3C%2FTransIDO%3E%0A++++%3CTransIDH%3E2016042214172002652655%3C%2FTransIDH%3E%0A++++%3CProcessTime%3E20160422141719%3C%2FProcessTime%3E%0A++++%3CResponse%3E%0A++++++++%3CRspType%3E0%3C%2FRspType%3E%0A++++++++%3CRspCode%3E0000%3C%2FRspCode%3E%0A++++++++%3CRspDesc%3Esuccess%3C%2FRspDesc%3E%0A++++%3C%2FResponse%3E%0A++++%3CSPReserve%3E%0A++++++++%3CTransIDC%3E201511230713519248570101408111%3C%2FTransIDC%3E%0A++++++++%3CCutOffDay%3E20151123%3C%2FCutOffDay%3E%0A++++++++%3COSNDUNS%3E0002%3C%2FOSNDUNS%3E%0A++++++++%3CHSNDUNS%3E8500%3C%2FHSNDUNS%3E%0A++++++++%3CConvID%3E%3C%2FConvID%3E%0A++++%3C%2FSPReserve%3E%0A++++%3CTestFlag%3E0%3C%2FTestFlag%3E%0A++++%3CMsgSender%3E8500%3C%2FMsgSender%3E%0A++++%3CMsgReceiver%3E8500%3C%2FMsgReceiver%3E%0A++++%3CSvcContVer%3E0100%3C%2FSvcContVer%3E%0A++++%3CSvcCont%3E%3C%21%5BCDATA%5B%3C%3Fxml+version%3D%221.0%22+encoding%3D%22UTF-8%22%3F%3E%0A%3CUserRsp%3E%0A++++%3CSubscrbId%3E9114031675586689%3C%2FSubscrbId%3E%0A++++%3CSubscrbStat%3E10%3C%2FSubscrbStat%3E%0A++++%3CBillingType%3E00%3C%2FBillingType%3E%0A++++%3CBrand%3E8%3C%2FBrand%3E%0A++++%3CCityCode%3E850%3C%2FCityCode%3E%0A++++%3COpenDate%3E20140316160456%3C%2FOpenDate%3E%0A++++%3CLandLvl%3E1%3C%2FLandLvl%3E%0A++++%3CRoamStat%3E1%3C%2FRoamStat%3E%0A++++%3CProductId%3E99003577%3C%2FProductId%3E%0A++++%3CProductName%3EWCDMA%283G%29-66%E5%85%83%E5%9F%BA%E6%9C%AC%E5%A5%97%E9%A4%90B%3C%2FProductName%3E%0A++++%3CSimCard%3E8986011388503492849%3C%2FSimCard%3E%0A++++%3CVpnName%3EWCDMA%3C%2FVpnName%3E%0A++++%3CCreditVale%3E0%3C%2FCreditVale%3E%0A++++%3CUseintegral%3E100%3C%2FUseintegral%3E%0A++++%3CAmount%3E%3C%2FAmount%3E%0A++++%3CCustName%3E%E7%A7%A6%E9%94%A1%E5%A8%9F%3C%2FCustName%3E%0A++++%3CVIPLev%3E%E4%B8%96%E7%95%8C%E9%A3%8E%E9%93%B6%E7%BA%A7%3C%2FVIPLev%3E%0A++++%3CBroadbandCode%3E%3C%2FBroadbandCode%3E%0A%3C%2FUserRsp%3E%0A%5D%5D%3E%3C%2FSvcCont%3E%0A%3C%2FUniBSS%3E%0A


---getOrders()-------

<![CDATA[<?xml+version="1.0"+encoding="UTF-8"?><BusinessRecordRsp>++++<ResultCode>0000</ResultCode>++++<ResultDESC>成功</ResultDESC>++++<BusinessRecordList>++++++++<ProductID>20440027</ProductID>++++++++<ProductName>3G短信包后付费</ProductName>++++++++<BrandName>虚拟网群</BrandName>++++++++<ProductExplain>3G短信包后付费</ProductExplain>++++++++<StartTime>2014-06-26+22:05:47</StartTime>++++++++<EndTime>2050-12-31+23:59:59</EndTime>++++</BusinessRecordList>++++<BusinessRecordList>++++++++<ProductID>20456023</ProductID>++++++++<ProductName>0元包50条短信包(集客产品)</ProductName>++++++++<BrandName>虚拟网群</BrandName>++++++++<ProductExplain>采用叠加式资费方案，在上述套餐基础上叠加IVPN和短信可选包。当用户选择126元及以上基本套餐时，叠加功能费0元，包50条短信。</ProductExplain>++++++++<StartTime>2015-05-08+17:07:35</StartTime>++++++++<EndTime>2050-12-31+23:59:59</EndTime>++++</BusinessRecordList>++++<BusinessRecordList>++++++++<ProductID>33001000</ProductID>++++++++<ProductName>3G-附加产品</ProductName>++++++++<BrandName>WCDMA</BrandName>++++++++<ProductExplain>3G-附加产品</ProductExplain>++++++++<StartTime>2016-04-26+21:55:30</StartTime>++++++++<EndTime>2050-12-30+00:00:00</EndTime>++++</BusinessRecordList>++++<BusinessRecordList>++++++++<ProductID>99003577</ProductID>++++++++<ProductName>WCDMA(3G)-66元基本套餐B</ProductName>++++++++<BrandName>WCDMA</BrandName>++++++++<ProductExplain>套餐月费66元，包国内语音拨打200分钟、国内流量60MB、国内接听免费（含可视电话），国内语音拨打0.20元/分钟、国内流量0.003元/KB、国内可视电话拨打0.60元/分钟，并赠送6个M、10个T、10分钟国内可视电话拨打、手机邮箱,套餐及叠加包内包含的业务量仅限当月使用，不能延续至下月使用</ProductExplain>++++++++<StartTime>2015-04-09+20:56:49</StartTime>++++++++<EndTime>2050-12-30+00:00:00</EndTime>++++</BusinessRecordList></BusinessRecordRsp>]]>

------addOrder() ----------

<?xml+version="1.0"+encoding="UTF-8"?><UniBSS>++++<OrigDomain>ECIP</OrigDomain>++++<HomeDomain>UCRM</HomeDomain>++++<BIPCode>GZWXB002</BIPCode>++++<BIPVer>0100</BIPVer>++++<ActivityCode>GZWXT001</ActivityCode>++++<ActionCode>1</ActionCode>++++<ActionRelation>0</ActionRelation>++++<Routing>++++++++<RouteType>04</RouteType>++++++++<RouteValue>0851</RouteValue>++++</Routing>++++<ProcID>ALUOP151123071351894382625439</ProcID>++++<TransIDO>ALUOP151123071351894382625439</TransIDO>++++<TransIDH>2016042716341402655395</TransIDH>++++<ProcessTime>20160427163414</ProcessTime>++++<Response>++++++++<RspType>2</RspType>++++++++<RspCode>2998</RspCode>++++++++<RspDesc>%E6%8A%A5%E6%96%87%E4%BD%93%E6%95%B0%E6%8D%AE%E9%94%99%E8%AF%AF..</RspDesc>++++</Response>++++<SPReserve>++++++++<TransIDC>201511230713519248570101408111</TransIDC>++++++++<CutOffDay>20151123</CutOffDay>++++++++<OSNDUNS>0002</OSNDUNS>++++++++<HSNDUNS>8500</HSNDUNS>++++++++<ConvID></ConvID>++++</SPReserve>++++<TestFlag>0</TestFlag>++++<MsgSender>8500</MsgSender>++++<MsgReceiver>8500</MsgReceiver>++++<SvcContVer>0100</SvcContVer>++++<SvcCont><![CDATA[+]]>

<![CDATA[<?xml+version="1.0"+encoding="UTF-8"?><PackageChangeRsp>++++<ResultCode>8888</ResultCode>++++<ResultDESC>ITF_CCHT_GRACETRADE_IVR执行异常:外围接口通用输入参数校验错误:[INDETERMINATE]ItfComFldCheck.cpp:82,13INTFException-400051:+接口输入参数公共校验：没有输入员工所在的部门/渠道标识!</ResultDESC></PackageChangeRsp>]]>

<![CDATA[<?xml+version="1.0"+encoding="UTF-8"?><PackageChangeRsp>++++<ResultCode>0000</ResultCode>++++<ResultDESC>成功</ResultDESC></PackageChangeRsp>]]>

 */