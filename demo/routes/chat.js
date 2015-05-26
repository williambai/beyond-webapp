exports =module.exports = function(app,models){
	var cookie = require('cookie');
	var cookieSignature = require('cookie-signature');
	var sio = require('socket.io').listen(app.server);

	app.isAccountOnline = function(accountId){
		// console.log(accountId);
		// console.log(sio.sockets.adapter.rooms[accountId]);
		var rooms = sio.sockets.adapter.rooms[accountId];
		return !!rooms;
	};

	sio.set('authorization', function(data,accept){
		var cookies = cookie.parse(data.headers.cookie);
		if(cookies['beyond.sid'] && cookies['beyond.sid'].length>2){
			var signedCookie = cookies['beyond.sid'].substr(2);
			// console.log(signedCookie);
			data.headers.sessionID = cookieSignature.unsign(signedCookie,app.sessionSecret);
			// console.log(data.sessionID);
			data.headers.sessionStore = app.sessionStore;
			data.headers.sessionStore.get(data.headers.sessionID,function(err,session){
				if(err || !session){
					console.log('Invalid session');
					return accept('Invalid session',false);
				}else{
					// console.log(session);
					data.headers.session = session;
					return accept(null, true);
				}
			});
		}else{
			return accept('Invalid cookie');
		}
	});
	sio.sockets.on('connection',function(socket){
		/**
		 * Description: use or update session
		 * 
		 * For examples:
		 * 
		 * console.log(socket.handshake.headers);
		 * var sessionID = socket.handshake.headers.sessionID;
		 * var session = socket.handshake.headers.session;
		 * session.aaa = 'bbb';
		 * var sessionStore = socket.handshake.headers.sessionStore;
		 * sessionStore.set(sessionID,session,function(err){
		 *	if(err){
		 *		console.log('SessionStore update error');
		 *		return;
		 *	}
		 * });
		 */
		var session = socket.handshake.headers.session;
		var accountId = session.accountId;
		var myAccount = null;

		socket.join(accountId);

		app.triggerEvent('event:' + accountId,{
			from: accountId,
			action: 'login'
		});

		var handleContactEvent = function(eventObj){
				socket.emit('contactEvent', eventObj);
			};
			
		var subscribeToAccount = function(accountId){
				var eventName = 'event:' + accountId;
				app.addEventListener(eventName,handleContactEvent);
				console.log('Subscribing to ' + accountId);
			};

		models.Account.findById(accountId,function(account){
			var subscribedAccounts = {};
			myAccount = account;

			account.contacts.forEach(function(contact){
				if(!subscribedAccounts[contact.accountId]){
					subscribeToAccount(contact.accountId);
					subscribedAccounts[contact.accountId] = true;
				}
			});
			if(!subscribedAccounts[accountId]){
				subscribeToAccount(accountId);
			}
		});

		socket.on('disconnect', function(){
			if(myAccount){
				myAccount.contacts.forEach(function(contact){
					var eventName = 'event:' + contact.accountId;
					app.removeEventListener(eventName, handleContactEvent);
					console.log('Unsubcribing from ' + eventName);
				});
				app.triggerEvent('event:' + accountId,{
					from: accountId,
					action: 'logout'
				});
			}
		});

		socket.on('chatclient', function(data){
			console.log('chatclient:');
			console.log(data);
			sio.sockets.in(data.to).emit('chatserver',{
				from: accountId,
				text: data.text
			});
		});
	});
};