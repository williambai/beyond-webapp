//** common package
var path = require('path');
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var config = require('../../config/sp').SGIP12;
//** logger package
var log4js = require('log4js');
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));
//** SGIP1.2 protocol
var CommandFactory = require('./lib/commands');
var Bind = CommandFactory.create('Bind');
var Unbind = CommandFactory.create('Unbind');
var Report = CommandFactory.create('Report');
var Deliver = CommandFactory.create('Deliver');
var StreamSpliter = require('./lib/StreamSpliter');

//** Make Resp PDU data
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
	logger.debug('<< resp PDU: ' + resp.toString('hex'));
	return resp;
};

var Receiver = function(){
	EventEmitter.call(this);
}
util.inherits(Receiver,EventEmitter);

Receiver.prototype.process = function(socket){
	var that = this;
	//** delay data parse 
	var handler = new StreamSpliter(socket);

	handler.on('message', function(buf) {
		// logger.debug(buf)
		var command;
		try {
			command = CommandFactory.parse(buf);
		} catch (e) {
			logger.error('command parse error.');
			that.emit('error', e);
			return socket.destroy();
		}
		if (command instanceof Bind) {
			logger.debug('>> Bind: ' + JSON.stringify(command));
			// logger.debug('>> Bind');
			if (command.LoginType == 2 &&
				command.LoginName == config.listener.LoginName &&
				command.LoginPassword == config.listener.LoginPassword) {
				logger.debug('>> Bind >> ok');
				//** write bind resp PDU
				socket.write(makeRespPDU(buf,0));
			} else {
				logger.debug('>> Bind >> error');
				//** write bind resp PDU
				socket.write(makeRespPDU(buf,1));
			}
		} else if (command instanceof Unbind) {
			logger.debug('>> Unbind: '+ JSON.stringify(command));
			//** unbind 4+4+12 = 20
			var resp = new Buffer(20);
			resp.writeUInt32BE(20, 0);
			resp.writeUInt32BE(0x80000002, 4);
			buf.copy(resp, 8, 8, 20);
			logger.debug('<< unbind resp PDU: ' + resp);
			socket.write(resp);
			socket.destroy();
		} else if (command instanceof Report) {
			logger.debug('>> Report: ' + JSON.stringify(command));
			//** notify 'report'
			that.emit('report', null, command);
			//** send resp PDU
			socket.write(makeRespPDU(buf,0));
		} else if (command instanceof Deliver) {
			logger.debug('>> Deliver: ' + JSON.stringify(command));
			//** notify 'deliver'
			that.emit('deliver', null, command);
			//** send resp PDU
			socket.write(makeRespPDU(buf,0));
		} else {
			//** write resp PDU
			//** 不提供此功能
			socket.write(makeRespPDU(buf,30));
		}
	});
};

exports = module.exports = Receiver;
