var orderFlux = require('../lib/order.flux');
// var orderFlux = require('../lib/order.flux.curl');

orderFlux({
	cwd: __dirname,//** 当前工作路径
	tempdir: './_tmp',
	staffId: 'ASCBWZS1', //** 贵阳
	// staffId: 'B90WZSLP',//** 六盘水
	phone: '15692740700',
	product: {
		name: '全国流量包(100元/1G)',
		price: '100',
		barcode: '3001_100_1024_0',
	}
}, function(err, result){
	if(err) return console.log(err);
	console.log(result);
});