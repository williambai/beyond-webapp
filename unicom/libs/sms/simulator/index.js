var net = require('net');
var CommandFactory = require('../lib/commands');
var Bind = CommandFactory.create('Bind');
var Unbind = CommandFactory.create('Unbind');
var Submit = CommandFactory.create('Submit');

var StreamSpliter = require('../lib/StreamSpliter');
var smsServer = net.createServer();

smsServer.on('connection', function(socket){
	console.log('客户端连接成功。');
	socket.on('end',function(){
		console.log('客户端连接断开。');
	});

	var handler = new StreamSpliter(socket);

	handler.on('message', function(buf) {
		// console.log(buf)
		var command = CommandFactory.parse(buf);
		console.log('---- start -----');		
		console.log(command);
		var resp = new Buffer(21);
		resp.writeUInt32BE(21,0);
		if( command instanceof Bind){
			console.log('>> Bind');
			resp.writeUInt32BE(0x80000001,4);
			console.log('<< Bind_Resp');
		}else if(command instanceof Unbind){
			console.log('>> Unbind');
			resp.writeUInt32BE(0x80000002,4);
			console.log('<< Unbind_Resp');
		}else if(command instanceof Submit){
			console.log(command.makePDU().length);
			console.log('>> Submit');
			resp.writeUInt32BE(0x80000003,4);
			console.log('<< Submit_Resp');
		}
		buf.copy(resp,8,8,20);
		resp.writeUInt8(0,20);
		console.log(resp);
		socket.write(resp);
		console.log('---- end -----\n\n\n');		
	});
	handler.on('end', function(){

	});
});

smsServer.listen(8801, function(){
	console.log('短信模拟服务器启动。port:8801');
});
