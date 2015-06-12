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
				console.log('+++重要调试，检查Contact事件数量。To(用户名)：' + session.username);
				socket.emit('contactEvent', eventObj);
			};
			
		var subscribeToAccount = function(accountId){
				var eventName = 'event:' + accountId;
				app.addEventListener(eventName,handleContactEvent);
			};

		var handleProjectEvent = function(eventObj){
				console.log('+++重要调试，检查Project事件数量。To(用户名)：' + session.username);
				console.log(eventObj);
				socket.emit('projectEvent', eventObj);
			};

		var subscribeToProject = function(projectId){
				var eventName = 'project:' + projectId
				app.addEventListener(eventName, handleProjectEvent);
			};

		models.Account.findById(accountId,function(account){
			var subscribedAccounts = {};
			var subscirbedProjects = {};
			if(account){
				myAccount = account;
				//订阅contact events
				account.contacts = account.contacts || [];
				account.contacts.forEach(function(contact){
					if(!subscribedAccounts[contact.accountId]){
						subscribeToAccount(contact.accountId);
						subscribedAccounts[contact.accountId] = true;
					}
				});
				//订阅自己account events
				if(!subscribedAccounts[accountId]){
					subscribeToAccount(accountId);
					subscribedAccounts[accountId] = true;
				}
				//订阅project events
				account.projects = account.projects || [];
				account.projects.forEach(function(project){
					if(!subscirbedProjects[project._id]){
						subscribeToProject(project._id);
						subscirbedProjects[project._id] = true;
					}
				});
			}
		});

		socket.on('disconnect', function(){
			if(myAccount){
				myAccount.contacts = myAccount.contacts || [];
				//退订 contanct events
				myAccount.contacts.forEach(function(contact){
					var eventName = 'event:' + contact.accountId;
					app.removeEventListener(eventName, handleContactEvent);
					// console.log('Unsubcribing from ' + eventName);
				});
				//退订 project events
				myAccount.projects = myAccount.projects || [];
				myAccount.projects.forEach(function(project){
					var eventName = 'project:' + project._id;
					app.removeEventListener(eventName, handleProjectEvent);
				});
				//声明自己logout
				app.triggerEvent('event:' + accountId,{
					from: accountId,
					action: 'logout'
				});
				//退订 accountId
				var eventName = 'event:' + accountId;
				app.removeEventListener(eventName, handleContactEvent);
			}
		});

		//receiving contact client
		socket.on('chatclient', function(data){
			// console.log('chatclient:');
			// console.log(data);
			var from = accountId;
			var to = data.to;
			if(data.action == 'chat'){
				models.Chat.add(from,to,{
					username: session.username,
					avatar: session.avatar,
					status: data.text,
				});
			}
			sio.sockets.in(data.to).emit('chatserver',{
				from: accountId,
				data: {
					username: session.username,
					avatar: session.avatar,
					text: data.text
				}
			});
		});

		//receiving project client 
		socket.on('projectclient', function(data){
			// console.log('+++')
			// console.log(data)
			var action = data.action; // 'chat'
			var to = data.to;
			var text = data.text;
			var message = {
					from: to,
					data: {
						userId: accountId,
						username: session.username,
						avatar: session.avatar,
						text: text,
					}
				};
			if(action == 'chat'){
				models.Status.add(accountId,to,session.username,session.avatar,text);
				app.triggerEvent('project:' + to, message);
			}
		});
	});

	// app.get('/chats/:toId',function(req,res){
	// 	var fromId = req.session.accountId;
	// 	var toId = req.params.toId;
	// 	var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
	// 	models.Chat.getByToId(toId,page,function(docs){
	// 		res.send(docs);
	// 	});
	// });
	app.get('/chats/:toId',function(req,res){
		var id1 = req.session.accountId;
		var id2 = req.params.toId;
		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
		models.Chat.getChatHistory(id1,id2,page,function(docs){
			res.send(docs);
		});
	});
};