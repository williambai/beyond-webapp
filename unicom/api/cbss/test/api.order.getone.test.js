/**
 * 模拟POST 发送订单
 * 
 */

var request = require('request');
var signature = require('../lib/signature');
var client = require('../config/clients')['9E251F7C'];//** test账号

var order_id = '57bc21f53e9cb15a2c123419';
var result = {
		action: 'getOne',
		data: {
			id: order_id,
		},
		timestamp: parseInt(((new Date()).getTime())/1000),
	};

request({
	url: 'http://localhost:3000/orders',
	method: 'POST',
	qs: signature.sign(client.key, client.secret),
	json: true,
	body: result,
},function(err,httpResponse,body){
	if(err) console.log(err);
	console.log('body:' + JSON.stringify(body));
});
