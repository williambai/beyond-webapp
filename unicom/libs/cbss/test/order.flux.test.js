var orderFlux = require('../lib/order.flux');

orderFlux({
	cwd: __dirname,//** 当前工作路径
	tempdir: './_tmp',
	staffId: 'B90WZSLP',//** 六盘水
	departId: '',
	provid: '85',//** 省份id
}, function(err, result){
	if(err) console.log(err);
	console.log(result);
});