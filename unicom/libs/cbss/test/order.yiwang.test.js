var orderYiwang = require('../lib/order.yiwang');
var account = (require('../../../config/cbss').accounts)[9];//** 1 贵阳， 9 遵义
console.log(account);

orderYiwang({
	cwd: __dirname,//** 当前工作路径
	tempdir: './_tmp',
	release: false,//** 开发模式
	staffId: account.staffId,
	// phone: '15692740700', //** 贵阳
	// phone: '18685106847', //** 李奇
	phone: '15599220698', //** 遵义
	product: {
		name: '贵州省流量风暴杯10元流量包-次月生效【贵州】',
		price: '10',
		// barcode: '89990196k51708887e8101109TD', //贵阳，贵州省风暴杯10元包立即生效
		// barcode: '89992192k51708887e8101109TD', //贵阳，贵州省风暴杯10元包次月生效
		// barcode: '89990194k51708888e8101119TD', //贵阳，贵州省风暴杯20元包立即生效
		// barcode: '89992193k51708888e8101119TD', //贵阳，贵州省风暴杯20元包次月生效
		// barcode: '89990192k51713628e8101511TD', //贵阳，贵州省风暴杯30元包立即生效
		// barcode: '89992194k51713628e8101511TD', //贵阳，贵州省风暴杯30元包次月生效
		// barcode: '89922087k51708887e8101109TD',//遵义，贵州省风暴杯10元包150M
		// barcode: '89922087k51708888e8101119TD',//遵义，贵州省风暴杯20元包包450M
		// barcode: '89922087k51713628e8101511TD',//遵义，贵州省风暴杯30元包1.5G省内流量包
		barcode: '89738265k51633110e5991245TD|89738265k51633110e5390171TD',//遵义4G用户10元100M国内流量-次月生效
	}
}, function(err, result){
	if(err) console.log(err);
	console.log(result);
});