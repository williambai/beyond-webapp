define(['Sockets'], function(sio){
	var development = true;

	var SocialNetSocket = function(options){
		var eventDispatcher = options.eventDispatcher;
		var socket = null;
		var accountId = null;

		var initialize = function(){
			eventDispatcher.bind('app:logined', connectSocket);
			// return socket;
		}

		var connectSocket = function(socketAccount){
			/* logout */
			eventDispatcher.on('app:logout', function(){
				if(socket){
					socket.close();
					socket = null;
				}
			});
			socket = sio.connect();

			accountId = socketAccount && socketAccount.accountId;

			socket.on('connect_failed', function(reason){
				console.error('Unable to connect',reason);
			});

			socket.on('connect', function(){
				console.info('established a connection successfully.');
				socket.emit('login');

				socket.on('disconnect',function(){
					console.info('socket disconnected by server.');
					eventDispatcher.off('socket');
					!development && window.location.reload();
				});

				//socket: in --> out
				eventDispatcher.on('socket:out:status',function(data){
					if(null != socket){
						socket.emit('status',data);
					}
				});

				eventDispatcher.on('socket:out:message',function(data){
					if(null != socket){
						socket.emit('leave a message',data);
					}
				});

				eventDispatcher.on('socket:out:chat',function(data){
					if(null != socket){
						socket.emit('chat',data);
					}
				});
				eventDispatcher.on('socket:out:project', function(data){
					if(null != socket){
						socket.emit('project', data);
					}
				});

				socket.on('login', function(data){
					if(data && data.from){
						var user = data.from;
						var eventName = 'socket:in:login:' + user.id;
						eventDispatcher.trigger(eventName,data);
					}
				});

				socket.on('logout', function(data){
					if(data && data.from){
						var user = data.from;
						var eventName = 'socket:in:logout:' + user.id;
						eventDispatcher.trigger(eventName,data);
					}
				});

				socket.on('status', function(data){
						var eventName = 'socket:in:status';
						eventDispatcher.trigger(eventName,data);
				});

				socket.on('receive a message', function(data){
						var eventName = 'socket:in:message';
						eventDispatcher.trigger(eventName,data);
				});

				socket.on('chat', function(data){
					if(data && data.from){
						var eventName1 = 'socket:in:chat';
						eventDispatcher.trigger(eventName1,data);
						var user = data.from;
						var eventName2 = 'socket:in:chat:' + user.id;
						eventDispatcher.trigger(eventName2,data);
					}
				});

				socket.on('project', function(data){
					if(data && data.to){
						var project = data.to;
						var eventName = 'socket:in:project:chat';
						var eventName2 = 'socket:in:project:notification:' + project.id;
						eventDispatcher.trigger(eventName,data);
						eventDispatcher.trigger(eventName2,data);
					}
				});

			});
		};

		return initialize;
	};

	return SocialNetSocket;
});