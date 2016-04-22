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

 */