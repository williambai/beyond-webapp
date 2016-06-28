/**
 * 
 * 命令行：
 * > node __filename
 * --or--
 * > node __filename 15692740700 http://130.85.50.34:7772/XMLReceiver
 * 
 */

var getOrders = require('../lib/getOrders');

//** Unit Test
if(process.argv[1] == __filename){
	//** 测试 getOrders()
	getOrders({
		url: process.argv[3] || 'http://130.85.50.34:7772/XMLReceiver',
		requestId: 'ALUOP151123071351894382625439' + parseInt(Math.random()*10000),
		BusinessType: '00',
		UserNumber: process.argv[2] || '15692740700',
	},function(err,result){
		if(err) return console.log(err);
		console.log(JSON.stringify(result));
	});
}