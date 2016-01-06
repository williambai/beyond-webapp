var net = require('net');

var smsServer = net.createServer();

var clients = {};
smsServer.on('connection', function(socket){
	// var id = socket.remoteAddress + ':' + socket.remotePort;
	// clients[id] = socket;

	socket.on('close', function(){
		socket.write('disconnect');
		socket.disconnect();
	});
	socket.on('data', function(data){

	});
});

smsServer.listen(9999);
