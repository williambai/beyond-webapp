var cookieRefresh = require('../lib/cookie');

cookieRefresh({
	cwd: __dirname,
	tempdir: './_tmp',
	staffId: 'B90WZSLP',//** 六盘水	
}, function(err, result){
	if(err) console.log(err);
	console.log(result);
});