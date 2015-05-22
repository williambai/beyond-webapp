define(['Sockets','views/ChatUsers','models/ContactCollection'], function(sio,ChatUsersView,ContactCollection){

	var SocialNetSocket = function(eventDispatcher){
		var socket = null;

		var initialize = function(){
			eventDispatcher.bind('app:logined', connectSocket);
		}

		var connectSocket = function(){
			socket = sio.connect();
			socket
				.on('connect_failed', function(reason){
					console.error('Unable to connect',reason);
				})
				.on('connect', function(){
					console.info('established a connection successfully.');
					//in --> out
					eventDispatcher.on('socket:chat',sendChat);
					//in <-- out
					socket.on('chatserver',function(data){
						eventDispatcher.trigger('socket:chat:start:' + data.from);
						eventDispatcher.trigger('socket:chat:in:' + data.from, data);
					});
					renderChatView();
				});
		};

		var sendChat = function(payload){
			if(null != socket){
				// console.log('send:'+ payload);
				socket.emit('chatclient',payload);
			}
		};

		var renderChatView = function(){
			var contactCollection = new ContactCollection();
			contactCollection.url = '/accounts/me/contacts';
			new ChatUsersView({
					collection:contactCollection,
					socketEvents: eventDispatcher
				}).render();
			contactCollection.fetch({reset:true});
		};

		return {
			initialize: initialize
		}
	};

	return SocialNetSocket;
});