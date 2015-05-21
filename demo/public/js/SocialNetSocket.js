define(['Sockets'],function(sio){
	var socket = null;

	var initialize = function(eventDispatcher){
		eventDispatcher.bind('app:logined', connectSocket);

	};
	var connectSocket = function(){
		socket = sio.connect();
		socket
			.on('connect_failed', function(reason){
				console.error('Unable to connect',reason);
			})
			.on('connect', function(){
				console.info('established a connection successfully.');
			});
	};

	return {
		initialize: initialize
	}
});