var path = require('path');
var log4js = require('log4js');
log4js.configure(path.join(__dirname, 'config/log4js.json'));
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));

var net = require('net');
var request = require('request');
var processSMS = require('./commands/processSMS');
var CommandFactory = require('./libs/sms').CommandFactory;
var Bind = CommandFactory.create('Bind');
var Unbind = CommandFactory.create('Unbind');
var Report = CommandFactory.create('Report');
var Deliver = CommandFactory.create('Deliver');

var StreamSpliter = require('./libs/sms').StreamSpliter;
var sgipSerice = net.createServer();

var config = require('./config/sp').SGIP12;

sgipSerice.on('error', function(err) {
	logger.error(err);
	sgipSerice.close(function(){
		logger.warn('sgip service is closed.');
	});
});

sgipSerice.on('connection', function(socket) {
	logger.debug('客户端连接成功。');
	//** 设置客户端连接超时
	socket.setTimeout(30000);
	//** 客户端发送FIN
	socket.on('end', function() {
		logger.debug('客户端连接断开。');
	});
	//** 客户端超时，则断开
	socket.on('timeout', function(){
		socket.destroy();
		logger.debug('客户端超时，断开连接');
	});

	var handler = new StreamSpliter(socket);

	var makeRespPDU = function(buf, result){
		//** resp PDU(unbind 例外): 
		//** 包含 4(总长度) + 4(command) + 12(序列号) + 1(result) + 8(保留) = 29
		var command = 0x80000000 + buf.readUInt32BE(4);
		var resp = new Buffer(29).fill(0x00);
		resp.writeUInt32BE(29,0);
		//** resp command: 0x80000000 + command 
		resp.writeUInt32BE(command,4);
		//** copy 序列号
		buf.copy(resp, 8, 8, 20);
		//** result
		resp.writeUInt8(result, 21);
		logger.debug('resp PDU: ' + resp.toString('hex'));
		return resp;
	};

	handler.on('message', function(buf) {
		// logger.debug(buf)
		var command;
		try {
			command = CommandFactory.parse(buf);
		} catch (e) {
			logger.error('command parse error.');
			return socket.destroy();
		}
		logger.debug('command: ' + JSON.stringify(command));
		if (command instanceof Bind) {
			// logger.debug('>> Bind');
			if (command.LoginType == 2 &&
				command.LoginName == config.listener.LoginName &&
				command.LoginPassword == config.listener.LoginPassword) {
				// logger.debug('>> Bind >> ok');
				//** write bind resp PDU
				socket.write(makeRespPDU(buf,0));
			} else {
				logger.debug('>> Bind >> error');
				//** write bind resp PDU
				socket.write(makeRespPDU(buf,1));
				socket.destroy();
			}
		} else if (command instanceof Unbind) {
			logger.debug('>> Unbind');
			//** unbind 4+4+12 = 20
			var resp = new Buffer(20);
			resp.writeUInt32BE(20, 0);
			resp.writeUInt32BE(0x80000002, 4);
			buf.copy(resp, 8, 8, 20);
			logger.debug('unbind resp PDU: ' + resp);
			socket.write(resp);
			socket.destroy();
		} else if (command instanceof Report) {
			logger.debug('>> Report');
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
						processSMS.report(command,function(){
							logger.info('<< Report command has been processed.');
						});
					}else if(ReportType == 1){
						//** deliver report
						
					}		
					break;
				case 2: //** 发送失败
					logger.debug('Report ErrorCode: ' + ErrorCode);
					break;
				default:
					break;
			}
			//** write report resp PDU
			socket.write(makeRespPDU(buf,0));
		} else if (command instanceof Deliver) {
			logger.debug('>> Deliver');
			logger.info('Deliver: ' + JSON.stringify(command));
			var UserNumber = command.UserNumber;
			var MessageCoding = command.MessageCoding;
			var MessageLength = command.MessageContent;
			var MessageContent = command.MessageContent;
			switch(MessageCoding){
				case 0: 
					processSMS.deliver(command,function(){
						logger.info('<< Deliver command has been processed.');
					});
					break;
				default:
					break;	
			}
			//** write report resp PDU
			socket.write(makeRespPDU(buf,0));
		} else {
			//** write resp PDU
			//** 不提供此功能
			socket.write(makeRespPDU(buf,30));
		}
	});
});

sgipSerice.listen(config.listener.port, function() {
	logger.info('SGIP短信接收服务启动在 port:' + config.listener.port);
});