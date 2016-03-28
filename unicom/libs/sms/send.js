//** common package
var util = require('util');
var net = require('net');
var path = require('path');
var EventEmitter = require('events').EventEmitter;
var config = require('../../config/sp').SGIP12;
//** logger package
var log4js = require('log4js');
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));
//** SGIP12 package
var CommandFactory = require('./lib/commands');
var Bind = CommandFactory.create('Bind');
var Unbind = CommandFactory.create('Unbind');
var Submit = CommandFactory.create('Submit');
var StreamSpliter = require('./lib/StreamSpliter');

var sendSMS = function(docs, done) {
	var doc;
	var newDocs = [];

	var client = net.connect({
		host: config.SPHost,
		port: config.SPPort,
	}, function() {
		logger.info('client connected.');
	});

	client.on('end', function(){
		logger.debug('client disconnected.');
		client.destroy();
		done && done(null, newDocs);
	});

	client.on('error', function(err) {
		logger.error(err);
		client.destroy();
		done && done(err);
	});

	client.on('timeout', function(err) {
		logger.error(err);
		client.destroy();
	});

	var handler = new StreamSpliter(client);

	var _submit = function(docs){
		//** send sms
		doc = docs.pop();
		if(!doc) {
			logger.debug('<< 5. submit finished.');
			//** send Unbind
			var unbind = new Unbind();
			var PDU = unbind.makePDU().slice(0,20);
			//** unbind只有20个字节
			PDU.writeUInt32BE(20, 0);
			client.write(PDU);
			logger.debug('>> 6. unbind');
			return;
		}
		var receivers = (doc.receiver || '').split(';');
		//** 构建Submit
		var submit = new Submit(receivers, 8, doc.content);
		//** 设置SMS头(8,20)
		var reqPDU = new Buffer(20);
		reqPDU.writeUInt32BE(doc.header.srcNodeID || 0, 8);
		reqPDU.writeUInt32BE(doc.header.cmdTime || 0, 12);
		reqPDU.writeUInt32BE(doc.header.cmdSeq || 0, 16);
		//** 发送SMS 
		client.write(submit.makePDU(reqPDU));
		logger.debug('>> 3. submit');
	};

	handler.on('message', function(buf) {
		var command = CommandFactory.parse(buf);
		logger.debug(command);
		if (command instanceof Bind.Resp) {
			if (command.Result != 0) {
				logger.debug('<< 2. resp error: ' + JSON.stringify(command));
				client.emit('end');
				return;
			}
			logger.debug('<< 2. bind_resp ok.');
			_submit(docs);
		} else if (command instanceof Unbind.Resp) {
			//** unbind
			logger.debug('<< 7. unbind_resp ok.');
			client.emit('end');
		} else if (command instanceof Submit.Resp) {
			if (command.Result != 0) {
				logger.debug('<< 2. resp error: ' + JSON.stringify(command));
				client.emit('end');
				return;
			}
			//** 保存command
			doc.command = command;
			newDocs.push(doc);
			logger.debug('<< 4. submit_resp ok. (if have more) submit continue...');
			_submit(docs);
		}
	});
	//** send Bind Command
	var bind = new Bind(1, config.SPUser, config.SPPass);
	client.write(bind.makePDU());
	logger.debug('>> 1.bind');
};

exports = module.exports = sendSMS;