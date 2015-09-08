// var options = {
// 	server: {
// 		url: 'https://106.37.212.162:9902/getlot.dll',
// 		key: 'key',
// 		secret: 'secret',
// 	},
// 	merchant: {
// 		merchantid: '853602',
// 		secret: '0123456789ABCDEF',
// 		prefix: 'HQT',
// 		callback: {
// 			url: 'http://121.199.20.138/cai/api/callback',
// 			host: '121.199.20.138',
// 			port: 80,
// 			path: 'cai/api/callback',
// 			method: 'POST',
// 		},
// 		ftp:  '/www/pureftpd',
// 	}
// };
var express = require('express');

var Lottery = require('../libs');

var app = express();

app.get('/',function(req,res){
	res.send('hello world!');
});
app.post('/getlot', function(req,res){
	res.send(req.body);
});

app.listen('9001',function(){
});
exports = module.exports = app;