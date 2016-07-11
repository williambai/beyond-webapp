var path = require('path');
var logger = require('log4js').getLogger(path.relative(process.cwd(), __filename));
var login = require('../lib/login');
var account = (require('../../../config/cbss').accounts)[1];//** 1 贵阳 ,9 遵义
console.log(account);

login({
	cwd: __dirname,//** 当前工作路径
	tempdir: './_tmp',
	user: account.staffId,
	pass: account.password,
	provid: account.provinceId,//** 省份id
}, function(err, response){
	if(err) console.log(err);
	//** {"status":"未登录","login":true,"message":"登录页参数获取成功！","meta":["<meta id=\"pagecontext\" pagename=\"Main\" productmode=\"true\" staffid=\"B90WZSLP\" staffname=\"李奇\" deptid=\"85b26xf\" deptcode=\"85b26xf\" deptname=\"沃助手六盘水运营渠道\" cityid=\"0858\" cityname=\"六盘水\" areacode=\"0858\" areaname=\"六盘水\" epachyid=\"0858\" epachyname=\"六盘水\" loginepachyid=\"0858\" version=\"BSS2PLUS\" provinceid=\"85\" subsyscode=\"BSS\" contextname=\"essframe\" logincheckcode=\"201605308524341354\" loginprovinceid=\"85\">"]}
	console.log(response);
	if(response.login){
		console.log('login');
	}else{
		console.log('logout');
	}
});