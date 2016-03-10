var util = require('util');
var EventEmitter = require('events').EventEmitter;

var StreamSpliter = function(eventEmitter) {
	EventEmitter.call(this);

	//** handler
	var that = eventEmitter || this;
	var message;
	var dueLen = false;
	var halfLen;
	var _handler = function(data) {
		// console.log(data);
		if (!dueLen) {
			try {
				//** message length
				dueLen = Buffer.prototype.readUInt32BE.call(data, 0);
			} catch (e) {
				that.emit('error', e);
				return;
			}
			if (dueLen === 0) {
				that.emit('end');
				return;
			}
			message = new Buffer(dueLen);
			halfLen = 0;
		}
		//** lack length 
		var lackLen = dueLen - halfLen;
		//** rest length
		var restLen = data.length - lackLen;
		if (restLen >= 0) {
			data.copy(message, halfLen, 0, lackLen);
			// console.log('+++++')
			// console.log(data.length)
			// console.log(dueLen)
			// console.log(restLen)
			// console.log(halfLen)
			// console.log(lackLen)
			// console.log('----')
			// console.log(message.length)
			that.emit('message', message);
			dueLen = false;
			if (restLen > 0)
				_handler(data.slice(lackLen));
		} else {
			//** 本次data全部为half
			data.copy(message, halfLen);
			halfLen += data.length;
		}
	};
	return _handler;
}

util.inherits(StreamSpliter, EventEmitter);

exports = module.exports = StreamSpliter;


//** unit test
if (process.argv[1] === __filename) {
	//** 准备测试数据
	var repeat = 3;
	var str = 'Li Yong';
	var len = str.length * repeat + 4;
	var bigBuf = new Buffer(11 * 3);
	for (var i = 0; i < 3; i++) {
		bigBuf.writeUInt32BE(11, i * 11);
		bigBuf.write(str, i * 11 + 4);
	}
	//** 创建事件处理对象
	var handler = new EventEmitter;
	handler.on('eror', function(err) {
		console.log(err);
	});
	handler.on('end', function() {
		console.log('end.');
	});
	handler.on('message', function(msg) {
		console.log('received message : ' + msg.toString('utf8', 4));
	});
	//** 创建处理函数
	var streamSpliter = StreamSpliter(handler);
	//** 处理数据
	streamSpliter(bigBuf);
}