/**
 * 状态图：
 * start -> bind
 * bind -> bindResp
 * bindResp -> (submit | end)
 * submit -> (submitResp | end)
 * submitResp -> (submit | end | unbind)
 * unbind -> unbindResp
 * unbindResp -> end
 */

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
	var endFlag = false;
	docs = docs || [];
	var docsLength = docs.length || 0;
	var results = [];

	var client = net.connect({
		host: config.SPHost,
		port: config.SPPort,
	}, function() {
		logger.debug('client connected.');
		//** send Bind Command
		var bind = new Bind(1, config.SPUser, config.SPPass);
		client.write(bind.makePDU(null,config['NodeID']));
		logger.debug('>> 1.bind');
	});

	client.setTimeout(10000);
	client.on('close', function(err){
		logger.debug('client close: ' + (err ? '异常': '正常'));
	});

	client.on('end', function(){
		logger.debug('client end.');
		if(!endFlag){
			client.destroy();
			endFlag = true;
			done && done(null, results);
		}
	});

	client.on('timeout', function(){
		logger.error('client 连接短信网关超时异常。');
		if(!endFlag){
			client.destroy();
			endFlag = true;
			done && done({code: 'timeout',errmsg: '发送短信超时异常。'});
		}
	});
	client.on('error', function(err) {
		logger.error(err);
		if(!endFlag){
			client.destroy();
			endFlag = true;
			done && done(err);
		}
	});

	// client.setTimeout(10000);
	// client.on('timeout', function(err) {
	// 	logger.error('client timeout.');
	// 	if(!endFlag){
	// 		client.destroy();
	// 		endFlag = true;
	// 		done && done('client timeout.');
	// 	}
	// });

	var handler = new StreamSpliter(client);

	//** 逐条(一起全部)发送SMS
	var _submit = function(){
		logger.debug('docs left: ' + docsLength);
		if(docsLength < 1) {
			logger.debug('<< 5. submit finished.');
			//** send Unbind
			var unbind = new Unbind();
			var PDU = unbind.makePDU(null, config['NodeID']).slice(0,20);
			//** unbind只有20个字节
			PDU.writeUInt32BE(20, 0);
			client.write(PDU);
			logger.debug('>> 6. unbind');
			return;
		}
		//** send sms
		docsLength--;
		var doc = docs[docsLength] || {};
		var receivers = (doc.receiver || '').split(';');
		var newReceivers = [];
		//** 短信号码前要加86
		receivers.forEach(function(receiver){
			//** 过滤符合11位长度的手机号码
			if(/\d{11}/.test(receiver)){
				newReceivers.push('86' + receiver.trim());
			}else{
				newReceivers.push(receiver.trim());
			}
		});
		//** 构建Submit
		var submit = new Submit(newReceivers, 8, doc.content, {
			SPNumber: doc.sender
		});
		//** 设置SMS头(8,20)
		var reqPDU = new Buffer(20);
		reqPDU.writeUInt32BE(doc.header.srcNodeID || 0, 8);
		reqPDU.writeUInt32BE(doc.header.cmdTime || 0, 12);
		reqPDU.writeUInt32BE(doc.header.cmdSeq || 0, 16);
		//** 发送SMS 
		client.write(submit.makePDU(reqPDU));
		logger.debug('>> 3. submit');
		_submit();
	};

	handler.on('message', function(buf) {
		var command = CommandFactory.parse(buf);
		logger.debug(command);
		if (command instanceof Bind.Resp) {
			if (command.Result != 0) {
				logger.debug('<< 2. resp error: ' + JSON.stringify(command));
				client.emit('error','bind resp error.');
				return;
			}
			logger.debug('<< 2. bind_resp ok.');
			_submit();
		} else if (command instanceof Unbind.Resp) {
			//** unbind
			logger.debug('<< 7. unbind_resp ok.');
			//** 结束发送
			client.emit('end');
		} else if (command instanceof Submit.Resp) {
			if (command.Result != 0) {
				logger.debug('<< 2. resp error: ' + JSON.stringify(command));
				client.emit('error','submit resp error.');
				return;
			}
			//** 保存发送结果command
			results.push(command);
			logger.debug('<< 4. submit_resp ok. (if have more) submit continue...');
		}
	});
};

exports = module.exports = sendSMS;


//** unit test
if (process.argv[1] == __filename) {
	var send = exports;
	var docs = [{
		header: {
			srcNodeID: 0001,
			cmdTime:123456,
			cmdSeq:0,
		},
		headerSeries: '106558364141259230',
		sender: '10655836',
		reciever: '15692740700',
		content: 'some content',
	}];

	send(docs, function(err, results) {
		if (err) return console.log(err);
		console.log(JSON.stringify(results));
	});
}