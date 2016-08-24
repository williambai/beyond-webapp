/**
 * 模拟GET 签名验证
 * 
 */

var request = require('request');
var signature = require('../lib/signature');
var client = require('../config/clients')['9E251F7C'];
// console.log(client);
var qs = signature.sign(client.key, client.secret);
console.log('query string: ' + JSON.stringify(qs));
request({
	url: 'http://localhost:3000/auth',
	method: 'GET',
	qs: qs,
},function(err,httpResponse,body){
	if(err) console.log(err);
	console.log('body:' + body);
});
