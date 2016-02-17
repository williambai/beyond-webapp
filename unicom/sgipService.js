var net = require('net');
var request = require('request');
var processSMS = require('./commands/processSMS');
var CommandFactory = require('./libs/sms').CommandFactory;
var Bind = CommandFactory.create('Bind');
var Unbind = CommandFactory.create('Unbind');
var Report = CommandFactory.create('Report');
var Deliver = CommandFactory.create('Deliver');

var handler = require('./libs/sms').handler;
var sgipSerice = net.createServer();

var config = require('./config/sp').SGIP12;

sgipSerice.on('error', function() {
	console.error('sgipSerice error.');
});

sgipSerice.on('connection', function(socket) {
	console.log('客户端连接成功。');
	socket.on('end', function() {
		socket.end();
		console.log('客户端连接断开。');
	});

	socket.on('response', function(buf) {
		// console.log(buf)
		var command;
		try {
			command = CommandFactory.parse(buf);
		} catch (e) {
			console.error('command parse error.');
			return socket.end();
		}
		console.log(command);
		if (command instanceof Bind) {
			console.log('>> Bind');
			if (command.loginType == 2 &&
				command.loginName == config.listener.loginName &&
				command.loginPass == config.listener.loginPass) {
				console.log('>> Bind >> ok');
				var resp = new Buffer(21);
				resp.writeUInt32BE(21, 0);
				resp.writeUInt32BE(0x80000001, 4);
				buf.copy(resp, 8, 8, 20);
				resp.writeUInt8(0, 20);
				console.log(resp);
				socket.write(resp);
			} else {
				var resp = new Buffer(21);
				resp.writeUInt32BE(21, 0);
				resp.writeUInt32BE(0x80000001, 4);
				buf.copy(resp, 8, 8, 20);
				resp.writeUInt8(1, 20);
				console.log(resp);
				socket.write(resp);
				socket.end();
			}
		} else if (command instanceof Unbind) {
			console.log('>> Unbind');
			var resp = new Buffer(21);
			resp.writeUInt32BE(21, 0);
			resp.writeUInt32BE(0x80000002, 4);
			buf.copy(resp, 8, 8, 20);
			resp.writeUInt8(0, 20);
			console.log(resp);
			socket.write(resp);
			socket.end();
		} else if (command instanceof Report) {
			console.log('>> Report');
			var srcNodeID = command.srcNodeID;
			var cmdTime = command.cmdTime;
			var cmdSeq = command.cmdSeq;
			var ReportType = command.ReportType;
			var UserNumber = command.UserNumber;
			var State = command.State;
			var ErrorCode = command.ErrorCode;
			switch(State){
				case 0: //** 发送成功
				case 1: //** 等待发送
					if(ReportType == 0){
						//** submit report
						processSMS.report(command,function(err){
							if(err) console.error(err);
						});
					}else if(ReportType == 1){
						//** deliever report
						
					}		
					break;
				case 2: //** 发送失败
					console.log('Report ErrorCode: ' + ErrorCode);
					break;
				default:
					break;
			}
			var resp = new Buffer(21);
			resp.writeUInt32BE(21, 0);
			resp.writeUInt32BE(0x80000003, 4);
			buf.copy(resp, 8, 8, 20);
			resp.writeUInt8(0, 20);
			console.log(resp);
			socket.write(resp);
		} else if (command instanceof Deliver) {
			console.log('>> Deliver');
			var UserNumber = command.UserNumber;
			var MessageCoding = command.MessageCoding;
			var MessageLength = command.MessageContent;
			var MessageContent = command.MessageContent;
			switch(MessageContent){
				case 1: 
					processSMS.reply(command,function(err){
						if(err) console.error(err);
					});
					break;
				default:
					break;	
			}
			var resp = new Buffer(21);
			resp.writeUInt32BE(21, 0);
			resp.writeUInt32BE(0x80000003, 4);
			buf.copy(resp, 8, 8, 20);
			resp.writeUInt8(0, 20);
			console.log(resp);
			socket.write(resp);
		} else {
			var resp = new Buffer(21);
			resp.writeUInt32BE(21, 0);
			resp.writeUInt32BE(0x80000003, 4);
			buf.copy(resp, 8, 8, 20);
			resp.writeUInt8(35, 20); //- unknown error
			console.log(resp);
			socket.write(resp);
		}
	});
	// socket.on('data', function(data){
	// 	console.log(data);
	// });
	socket.on('data', handler(socket));
});

sgipSerice.listen(config.listener.port, function() {
	console.log('SGIP短信接收服务启动在 port:' + config.listener.port);
});