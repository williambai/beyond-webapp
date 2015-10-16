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
var request = require('request');
var restify = require('restify');
var fs = require('fs');
var path = require('path');
var app = restify.createServer();

app.use(restify.queryParser());
app.use(restify.bodyParser());

var merchant = {
		merchantid: '853602',
		secret: '0123456789ABCDEF',
		prefix: 'HQT',
		callback_url: 'http://localhost:8526/api/callback',
		ftp:  '/www/pureftpd',
	};

app.get('/',function(req,res){
	res.send('hello world!');
});

app.post('/getlot/:command', function(req,res){
	req.body = req.body.toString();
	console.log(req.body)
	var command = req.params.command;
	switch(command){
		case '1000': 
			res.set('content-type', 'text/plain');
			res.send(
				'<?xml version="1.0" encoding="utf-8"?>' +
				'<message>' +
					'<head>' +
						'<messageid>85360220121117886544012345678901</messageid>' +
						'<command>1000</command>' +
						'<encrypt>0</encrypt>' +
						'<compress>0</compress>' +
						'<timestamp>20121026214317</timestamp>' +
						'<bodymd>3d1b540ec6502aa0613e449685cdb193</bodymd>' +
					'</head>' +
					'<body>' +
						'<ltype>QGSLTO</ltype>' +
						'<periodnum>2012127</periodnum>' +
						'<allprintresult>0</allprintresult>' +
						'<records>' +
							'<record>' +
								'<orderno>ABC13531168011521</orderno>' +
								'<printresult>0</printresult>' +
								'<printtime>20121026214134</printtime>' +
								'<failreason>00</failreason>' +
								'<orderamount>1000</orderamount>' +
								'<cpserial/>' +
							'</record>' +
						'</records>' +
					'</body>' +
				'</message>'
			);
		break;
		case '1001':
		case '1002':
			var buffer = fs.readFileSync(path.join(__dirname,'fixtures/simulator/response/command'+ command +'.xml'));
			var str = buffer.toString('utf8');
			console.log(str);
			res.set('content-type', 'text/plain');
			res.send(str);
			break;
		default:
			res.set('content-type', 'text/plain');
			res.send(
				'<?xml version="1.0" encoding="utf-8"?>'+
				'<error>'+
					'<code>40110</code>' +
					'<message>command not supported.</message>' +
				'</error>'
			);	
			break;	
	}
});

// setInterval(function(){
// 	var body = fs.readFileSync(path.join(__dirname,'fixtures/simulator/response/command2000.xml')).toString('utf8');
// 	console.log('lottery simulator server callback at: ' + merchant.callback_url);
// 	request({
// 			url: merchant.callback_url,
// 			headers:{
// 				'content-type': 'application/json',
// 			},
// 			method: 'POST',
// 			body: JSON.stringify({"a":1}), 
// 		}, function(err,response){
// 		if(err) return console.log(err);
// 		console.log(response.body);
// 	});
// },10000);

app.listen('9001',function(){
	console.log('%s listening at %s', 'lottery simulator server', 9001);
});
exports = module.exports = app;