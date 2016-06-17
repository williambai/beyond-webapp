var orderFlux = require('../lib/order.flux');
var account = (require('../../../config/cbss').accounts)[1];//** 贵阳
console.log(account);
orderFlux({
	cwd: __dirname,//** 当前工作路径
	tempdir: './_tmp',
	release: false,//** 开发模式
	staffId: account.staffId, 
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