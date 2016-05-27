var BSS = require('../lib/getOrders');

//** Unit Test
if(process.argv[1] == __filename){
	//** 测试 getOrders()
	BSS.getOrders({
		url: 'http://130.85.50.34:7772/XMLReceiver',
		requestId: 'ALUOP151123071351894382625439' + parseInt(Math.random()*10000),
		BusinessType: '00',
		UserNumber: '15692740700',
	},function(err,result){
		if(err) return console.log(err);
		console.log(JSON.stringify(result));
	});
}