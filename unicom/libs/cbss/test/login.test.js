var login = require('../lib/login');

login({
	cwd: __dirname,//** 当前工作路径
	tempdir: './_tmp',
	user: 'B90WZSLP',//** 六盘水
	pass: 'Lq19880625',
	provid: '85',//** 省份id
}, function(err, result){
	if(err) console.log(err);
	console.log(result);
});