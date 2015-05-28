define(['Sockets','views/ChatUsers','models/ContactCollection'], function(sio,ChatUsersView,ContactCollection){

	var SocialNetSocket = function(eventDispatcher){
		var socket = null;
		var accountId = null;

		var initialize = function(){
			eventDispatcher.bind('app:logined', connectSocket);
		}

		var connectSocket = function(socketAccount){
			accountId = socketAccount && socketAccount.accountId;
			socket = sio.connect();
			socket
				.on('connect_failed', function(reason){
					console.error('Unable to connect',reason);
				})
				.on('connect', function(){
					console.info('established a connection successfully.');
					//in --> out
					eventDispatcher.on('socket:chat',handleSendChat);

					//in <-- out
					socket.on('contactEvent', handleContactEvent);
					socket.on('chatserver',handleChatEvent);

					renderChatView();
				});
		};

		var handleSendChat = function(payload){
			if(null != socket){
				console.log(accountId +' send:');
				console.log(payload);
				socket.emit('chatclient',payload);
			}
		};

		var handleContactEvent = function(eventObj){
			var eventName = eventObj.action + ':' + eventObj.from;
			if(eventObj.from == accountId){
				eventName = eventObj.action + ':me';
			}
			console.log(accountId + ' receive: ' + eventName);
			console.log(eventObj);
			eventDispatcher.trigger(eventName,eventObj);
		};

		var handleChatEvent = function(data){
			eventDispatcher.trigger('socket:chat:start:' + data.from);
			eventDispatcher.trigger('socket:chat:in:' + data.from, data);
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