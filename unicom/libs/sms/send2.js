//** common package
var _ = require('underscore');
var util = require('util');
var net = require('net');
var path = require('path');
var EventEmitter = require('events').EventEmitter;
//** logger package
var log4js = require('log4js');
var logger = log4js.getLogger(path.relative(process.cwd(), __filename));
//** SGIP12 package
var CommandFactory = require('./lib/commands');
var Bind = CommandFactory.create('Bind');
var Unbind = CommandFactory.create('Unbind');
var Submit = CommandFactory.create('Submit');
var StreamSpliter = require('./lib/StreamSpliter1');

//** 本地变量
var client = null; //** socket客户端
var queues = []; //** 发送队列
var eventEmitter = new EventEmitter(); //** 

var exec = function(options){
	if(client) return eventEmitter.emit('ready');
	//*** socket客户端不存在
	return logger.debug('++++++')

	//** 建立远程连接
	client = net.connect({
		host: options.SPHost,
		port: options.SPPort,
	});
	
	client.on('end', function(){
		logger.debug('Resp接收数据异常，SGIP client关闭');
		client.destroy();
		client = null;
	});
	client.on('error', function(err) {
		logger.error('SGIP client 异常退出');
		logger.error(err);
		client.destroy();
		client = null;
	});

	client.on('timeout', function() {
		logger.debug('超时，SGIP client 关闭');
		client.destroy();
		client = null;
	});

	client.on('connection', function() {
		logger.info('client connected.');
		//** 启动，send Bind Command
		var bind = new Bind(1, options.SPUser, options.SPPass);
		client.write(bind.makePDU());
		logger.debug('>> 1.bind');
	});

	//** 处理接收数据
	var handler = new EventEmitter;
	handler.on('error', function(){
		console.log('message length error。');
		client.destroy();
		client = null;
	});
	handler.on('message', function(buf) {
		var command = CommandFactory.parse(buf);
		logger.debug('<< Resp Command: ' + JSON.stringify(command));
		if (command instanceof Bind.Resp) {
			if (command.Result != 0) {
				logger.debug('<< 2. resp error: ' + JSON.stringify(command));
				client.emit('end');
				return;
			}
			logger.debug('<< 2. bind_resp ok.');
			eventEmitter.emit('ready');

		} else if (command instanceof Unbind.Resp) {
			//** unbind
			logger.debug('<< 7. unbind_resp ok.');
			eventEmitter.emit('end');
		} else if (command instanceof Submit.Resp) {
			//** 接收错误处理？
			if (command.Result != 0) {
				logger.debug('<< 2. resp error: ' + JSON.stringify(command));
				client.emit('end');
				return;
			}
			//** 接收正常处理
			//** 保存command
			var header = command.header;
			var series = header.srcNodeID + '' + header.cmdTime + '' + header.cmdSeq;
			eventEmitter.emit('sent',command);
		}
	});			
	//** 接收数据
	client.on('data', StreamSpliter(handler));
};

var sendSms  = function(){
	//** client已建立，可以发送SMS
	while(1){
		var queue = queues.pop();
		if(!queue) break;
		var doc = queue.doc || {};
		var options = queue.options || {};
		var done = queue.done || function(){};

		var sms = {};
		var receivers = (doc.receiver || '').split(';');
		//** send Submit
		var submit = new Submit(receivers, 8, doc.content, {
			SPNumber: doc.sender || options.SPNumber
		});
		//** 设置SMS头(8,20)
		var reqPDU = new Buffer(20);
		reqPDU.writeUInt32BE(doc.header.srcNodeID || 0, 8);
		reqPDU.writeUInt32BE(doc.header.cmdTime || 0, 12);
		reqPDU.writeUInt32BE(doc.header.cmdSeq || 0, 16);
		//** 发送SMS 
		client.write(submit.makePDU(reqPDU));
		logger.debug('>> 3. submit');
	}
};

eventEmitter.on('send', send);
eventEmitter.on('ready',sendSms);

var send = function(docs,options,done){
	//** 判定参数
	if (arguments.length < 3) throw new Error('参数不足：function(docs, options, done)。');
	options = options || {};
	if (!(options.SPHost &&
			options.SPPort &&
			options.SPUser && 
			options.SPPass && 
			options.SPNumber)) throw new Error('options对象参数不足，至少包含：{SPHost,SPPort,SPUser,SPPass,SPNumber}。');

	_.each(docs, function(doc){
		//** 创建请求对象
		queues.push({
			doc: doc,
			options: options,
			done: done
		});
	});
	logger.info('总共要发送 ' + docs.length + ' 条短信');
	//** 触发一次
	eventEmitter.emit('send', options);
};

exports = module.exports = send;


//** unit test
if (process.argv[1] == __filename) {
	var send = exports;
	var docs = [{
		mobile: '15620001781',
		content: 'some content',
	}, {
		mobile: '15620001782',
		content: 'some content',
	}, {
		mobile: '15620001783',
		content: 'some content',
	}];

	send(docs, {
		SPHost: 'localhost',
		SPPort: 8801,
		SPUser: 'user',
		SPPass: 'pass',
		SPNumber: '1065583600001'
	}, function(err, newDocs) {
		if (err) return console.log(err);
		console.log(JSON.stringify(newDocs));
	});
}


// sms[series].command = command;
// count--;
// //** 还有未接收到的Resp，继续
// logger.debug('<< 4. submit_resp ok. 还剩 ' + count + ' 条未收到Resp');
// if(count == 0) {
// 	//** 已经全部接收到Resp的处理
// 	logger.debug('<< 5. submit finished.');
// 	//** send Unbind
// 	var unbind = new Unbind();
// 	var PDU = unbind.makePDU().slice(0,20);
// 	//** unbind只有20个字节
// 	PDU.writeUInt32BE(20, 0);
// 	client.write(PDU);
// 	logger.debug('>> 6. unbind');
// 	return;
// }


		// var PDU = submit.makePDU();
		// //** 提取序列号
		// var PDUMessage = submit.parse(PDU);
		// // console.log(PDUMessage);
		// var header = PDUMessage.header || '';
		// var series = header.srcNodeID + '' + header.cmdTime + '' + header.cmdSeq;		
		// //** 建立sms发送对象
		// sms = {
		// 	doc: doc,
		// 	submit: PDU
		// };
		// client.write(sms.submit);



	// var _send = function(){
	// 	//** 循环创建submit，建立短信序列号对象组
	// 	var sms = {};
	// 	//** 要处理的sms总数
	// 	var count = 0;
	// 	_.each(docs, function(doc) {
	// 		var receivers = (doc.receiver || '').split(';');
	// 		//** send Submit
	// 		var submit = new Submit(receivers, 8, doc.content, {
	// 			SPNumber: options.SPNumber
	// 		});
	// 		var PDU = submit.makePDU();
	// 		//** 提取序列号
	// 		var PDUMessage = submit.parse(PDU);
	// 		// console.log(PDUMessage);
	// 		var header = PDUMessage.header || '';
	// 		var series = header.srcNodeID + '' + header.cmdTime + '' + header.cmdSeq;
	// 		//** 建立sms发送对象
	// 		sms[series] = {
	// 			doc: doc,
	// 			submit: PDU
	// 		};
	// 		//** 增加计数
	// 		++count;
	// 	});
		// console.log(sms);
	// };