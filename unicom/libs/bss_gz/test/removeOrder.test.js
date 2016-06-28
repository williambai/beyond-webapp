var removeOrder = require('../lib/removeOrder');

//** Unit Test
if(process.argv[1] == __filename){
	//** 测试 removeOrder()
	removeOrder({
		url: 'http://130.85.50.34:7772/XMLReceiver',
		requestId: 'seq00001' + parseInt(Math.random()*10000),
		ProductId: '99013000',
		ProductType: '1',
		StaffID: 'SUPERUSR',
		DepartID: 'Z0851',
		UserNumber: '15692740700',
	},function(err,result){
		if(err) return console.log(err);
		console.log(JSON.stringify(result));
	});
}