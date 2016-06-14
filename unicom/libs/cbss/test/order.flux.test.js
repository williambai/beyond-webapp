var orderFlux = require('../lib/order.flux');
// var orderFlux = require('../lib/order.flux.curl');

orderFlux({
	cwd: __dirname,//** 当前工作路径
	tempdir: './_tmp',
	release: false,//** 开发模式
	staffId: 'ASCBWZS1', //** 贵阳
	// staffId: 'B90WZSLP',//** 六盘水
	phone: '15692740700',
	product: {
		name: '全国流量包(50元/500M)',
		price: '50',
		barcode: '3001_50_500_0',
		zk: '50',
	}
}, function(err, result){
	if(err) return console.log(err);
	console.log(result);
});