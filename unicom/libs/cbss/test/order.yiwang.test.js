var orderYiwang = require('../lib/order.yiwang');
var account = (require('../../../config/cbss').accounts)[1];//** 贵阳
console.log(account);

orderYiwang({
	cwd: __dirname,//** 当前工作路径
	tempdir: './_tmp',
	staffId: account.staffId,
	phone: '15692740700',
	product: {
		name: '贵州省流量风暴杯10元流量包-立即生效【贵州】',
		price: '10',
		barcode: '89990196',
	}
}, function(err, result){
	if(err) console.log(err);
	console.log(result);
});