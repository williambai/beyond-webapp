var cookieRefresh = require('../lib/cookie');
var account = (require('../../../config/cbss').accounts)[1];//** 贵阳
console.log(account);

cookieRefresh({
	cwd: __dirname,
	tempdir: './_tmp',
	staffId: account.staffId,
}, function(err, response){
	if(err) console.log(err);
	//** { meta: [ '<meta id="pagecontext" pagename="Nav" productmode="true" staffid="B90WZSLP" staffname="李奇" deptid="85b26xf" deptcode="85b26xf" deptname="沃助手六盘水运营渠道" cityid="0858" cityname="六盘水" areacode="0858" areaname="六盘水" epachyid="0858" epachyname="六盘水" loginepachyid="0858" version="BSS2PLUS" provinceid="85" subsyscode="BSS" contextname="essframe" logincheckcode="201605308524341354" loginprovinceid="85">' ], status: '已登录' }
	console.log(response);
	if(response.login){
		console.log('login');
	}else{
		console.log('logout');
	}
});