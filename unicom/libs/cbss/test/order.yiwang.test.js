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
		// barcode: '89990196' + 'k' + '51708887' + 'e' + '8101109' + 'TD', //10元包立即生效
		barcode: '89992192k51708887e8101109TD', //10元包次月生效
		// barcode: '89990194k51708888e8101119TD', //20元包立即生效
		// barcode: '89992193k51708888e8101119TD', //20元包次月生效
		// barcode: '89990192k51713628e8101511TD', //30元包立即生效
		// barcode: '89992194k51713628e8101511TD', //30元包次月生效
	}
}, function(err, result){
	if(err) console.log(err);
	console.log(result);
});