var handler = function(socket){
	var message;
	var dueLen = false;
	var halfLen;
	var _handler = function(data){
		// console.log(data);
		if (!dueLen) {
			try {
				dueLen = Buffer.prototype.readUInt32BE.call(data, 0);
			} catch (e) {
				socket.end();
				console.log('服务端因解析错误而被迫断开客户端的连接。');
				socket.removeListener('data', _handler);
				return;
			}
			if (dueLen === 0) {
				socket.end();
				console.log('服务端因协议错误(消息长度为0)而被迫断开客户端的连接。');
				socket.removeListener('data', _handler);
				return;
			}
			message = new Buffer(dueLen);
			halfLen = 0;
		}
		var lackLen = dueLen - halfLen;
		var restLen = data.length - lackLen;
		if (restLen >= 0) {
			data.copy(message, halfLen, 0, lackLen);
			socket.emit('response', message);
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
};
exports = module.exports = handler;