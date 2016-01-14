var net = require('net');
var CommandFactory = require('../lib/commands');
var Bind = CommandFactory.create('Bind');
var Unbind = CommandFactory.create('Unbind');
var Submit = CommandFactory.create('Submit');

var handler = require('../lib/handler');
var smsServer = net.createServer();

smsServer.on('connection', function(socket){
	console.log('客户端连接成功。');
	socket.on('end',function(){
		console.log('客户端连接断开。');
	});

	socket.on('response', function(buf) {
		// console.log(buf)
		var request = CommandFactory.parse(buf);
		console.log(request);
		var resp = new Buffer(21);
		resp.writeUInt32BE(21,0);
		if(request instanceof Bind){
			console.log('>> Bind');
			resp.writeUInt32BE(0x80000001,4);
		}else if(request instanceof Unbind){
			console.log('>> Unbind');
			resp.writeUInt32BE(0x80000002,4);
		}else if(request instanceof Submit){
			console.log('>> Submit');
			resp.writeUInt32BE(0x80000003,4);
		}
		buf.copy(resp,8,8,20);
		resp.writeUInt8(0,20);
		console.log(resp);
		socket.write(resp);
	});
	// socket.on('data', function(data){
	// 	console.log(data);
	// });
	socket.on('data', handler(socket));
});

smsServer.listen(8124, function(){
	console.log('短信模拟服务器启动。port:8124');
});
