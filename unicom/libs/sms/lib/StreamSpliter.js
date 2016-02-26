var util = require('util');
var EventEmitter = require('events');

var StreamSpliter = function(stream){
	var that = this;
	EventEmitter.call(this);

	//** stream handler
	var message;
	var dueLen = false;
	var halfLen;
	var _handler = function(data){
		// console.log(data);
		if (!dueLen) {
			try {
				//** message length
				dueLen = Buffer.prototype.readUInt32BE.call(data, 0);
			} catch (e) {
				that.emit('error',e);
				console.log('message length error。');
				stream.removeListener('data', _handler);
				return;
			}
			if (dueLen === 0) {
				that.emit('end');
				console.log('data end.');
				stream.removeListener('data', _handler);
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

	//** process stream data
	stream.on('data', _handler);
};



util.inherits(StreamSpliter,EventEmitter);

exports = module.exports = StreamSpliter;

//** unit test
if (process.argv[1] === __filename) {
  var net = require('net');
  (function(){
    var server = net.createServer(function(c){
      console.log('client connected.');
      var spliter = new StreamSpliter(c);
      spliter.on('test', function(str){
        console.log(str);
      })
      spliter.on('message', function(msg){
        console.log('received message : ' + msg.toString('utf8', 4));
      });
    });
    server.listen(3000);
    var socket = net.Socket();
    socket.connect(3000, function(){
      var repeat = 3;
      var str = 'Li Yong';
      var len = str.length * repeat + 4;
      var bigBuf = new Buffer(11 * 3);
      for (var i = 0; i < 3; i++) {
        bigBuf.writeUInt32BE(11, i * 11);
        bigBuf.write(str, i * 11 + 4);
      }
      socket.write(bigBuf);
      var buf = new Buffer(4);
      buf.writeUInt32BE(len, 0);
      socket.write(buf);
      var intervalID = setInterval(function(){
        if (--repeat === 0) {
          clearInterval(intervalID);
        }
        socket.write(str);
      }, 1000);
    })
  })();
}
