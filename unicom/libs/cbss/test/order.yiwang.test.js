var orderYiwang = require('../lib/order.yiwang');

orderYiwang({
	cwd: __dirname,//** 当前工作路径
	tempdir: './_tmp',
	staffId: 'ASCBWZS1', //** 贵阳
	// staffId: 'B90WZSLP',//** 六盘水
	phone: '15692740700',
	product: {
		name: '联通秘书',
		price: '5',
		barcode: '',
	}
}, function(err, result){
	if(err) console.log(err);
	console.log(result);
});