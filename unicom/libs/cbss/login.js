var fs = require('fs');
var path = require('path');
var certFile = path.resolve(__dirname, 'ssl/agent.crt');
var keyFile = path.resolve(__dirname, 'ssl/agent.key');
var caFile = path.resolve(__dirname, 'ssl/unicom.ca.pem');
var request = require('request');
var async = require('async');


// var options = {
//   key: fs.readFileSync(keyFile),
//   cert: fs.readFileSync(certFile),
//   // ca: fs.readFileSync(caFile),
// };

// require('https').createServer(options, function (req, res) {
//   res.writeHead(200);
//   res.end("hello world\n");
// }).listen(8000);

// return;

var https = require('https');
var options = {
	// key: fs.readFileSync(keyFile),
	// cert: fs.readFileSync(certFile),
	// ca: fs.readFileSync(caFile),
	rejectUnauthorized: false,
	family: 4,
	hostname: 'cbss.10010.com',
	port: 443,
	path: '/essframe',
	method: 'GET',
	headers: {
		'Accept-Language': 'zh-CN',
		'Accept': 'text/html, application/xhtml+xml, */*',
		'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko',
		'Connection': 'Keep-Alive',		
	}
};

options.agent = new https.Agent(options);
// process.debug = true;
var req = https.request(
	options, function(res){
  console.log('statusCode: ', res.statusCode);
  console.log('headers: ', res.headers);

  res.on('data', function(d){
    process.stdout.write(d);
  });
});
req.end();
req.on('error', function(e){
  console.error(e);
});
console.log('----');
// return;

request.debug = true;

async.waterfall(
	[
		// function(callback){
		// 	var https = require('https');
		// 	var options = {
		// 		hostname: 'kyfw.12306.cn',
		// 		port: 443,
		// 		path: '/',
		// 		method: 'GET',
		// 		// rejectUnauthorized: false,
		// 		// cert: fs.readFileSync(certFile),
		// 		// key: fs.readFileSync(keyFile),
		// 		ca: fs.readFileSync(caFile),
		// 	};
		// 	// options.agent = new https.Agent(options);
		// 	var req = https.request(options, function(res){
		// 		console.log(res);
		// 	})
		// 	console.log('+++');
		// 	req.end();
		// },
		function getCookies(callback) {
			request({
				// url: 'https://localhost:8000',
				url: 'https://cbss.10010.com/essframe',
				// agent: false,
				// agentOptions: {
					// cert: fs.readFileSync(certFile),
					// key: fs.readFileSync(keyFile),
					ca: fs.readFileSync(caFile),
					// secureProtocol: 'SSLv3_method',
					securityOptions: 'SSL_OP_NO_TLSv1_2',//'SSL_OP_NO_SSLv3',
					// requestCert: true,
					// rejectUnauthorized: false,
				// },
				strictSSL:false,
				method: 'GET',
				headers: {
					'Accept-Language': 'zh-CN',
					'Accept': 'text/html, application/xhtml+xml, */*',
					'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko',
					'Connection': 'Keep-Alive',
				},
			}, function(err, response, body) {
console.log('++++')
console.log(body)
				if (err) return callback(err);
				callback(null);
			});
		},
	],
	function(err, result) {
		if (err) return console.log(err);
		console.log('登录成功！');
	}
);