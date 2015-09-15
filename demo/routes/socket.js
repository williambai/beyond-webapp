exports =module.exports = function(app,models){
	var cookie = require('cookie');
	var cookieSignature = require('cookie-signature');
	var sio = require('socket.io').listen(app.server);
	var mongoAdapter = require('socket.io-adapter-mongo');
	sio.adapter(mongoAdapter({ host: '127.0.0.1', port: 27017, db: 'socketio' }));

	app.isAccountOnline = function(accountId){
		// console.log(accountId);
		// console.log(sio.sockets.adapter.rooms[accountId]);
		// var rooms = sio.sockets.adapter.rooms[accountId];
		// return !!rooms;
		var socket = users[accountId];
		return !!socket;
	};

	sio.set('authorization', function(data,accept){
		var cookies = cookie.parse(data.headers.cookie);
		if(cookies['beyond.sid'] && cookies['beyond.sid'].length>2){
			var signedCookie = cookies['beyond.sid'].substr(2);
			// console.log(signedCookie);
			var sessionID = cookieSignature.unsign(signedCookie,app.sessionSecret);
			// console.log(sessionID);
			app.sessionStore.get(sessionID,function(err,session){
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

	var users = {};

	sio.on('connection', function(socket){
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
		socket.on('disconnect', function(){
			var user = socket.user;
			if(user && user.id){
				socket.in(user.id).emit('logout',{from: user});
				users[user.id] = null;
			}
		});

		socket.on('login', function(){
			var session = socket.handshake.headers.session || {};
			var user = {
					id: session.accountId || 0,
					avatar: session.avatar || '',
					username: session.username || '匿名'
				};			
			if(user.id){
				users[user.id] = socket;
				socket.user = user;
			}
			if(user && user.id){
				var roomId = user.id;
				socket.in(roomId).emit('login',{from: user});
				models.Account.findById(user.id,function(account){
					var joinedAccounts = {};
					var joinedProjects = {};
					if(account){
						//join contacts' room
						account.contacts = account.contacts || [];
						account.contacts.forEach(function(contact){
							if(!joinedAccounts[contact.accountId]){
								socket.join(contact.accountId);
								joinedAccounts[contact.accountId] = true;
							}
						});
						//join projects' room
						account.projects = account.projects || [];
						account.projects.forEach(function(project){
							if(!joinedProjects[project._id]){
								socket.join(project._id);
								joinedProjects[project._id] = true;
							}
						});
					}
				});
			}
		});

		socket.on('logout', function(){
			var user = socket.user;
			if(user && user.id){
				var roomId = user.id;
				socket.in(roomId).emit('logout',{from: user});
			}else{
				console.error('logout error.');
			}
			users[user.id] = null;
			socket.user = null;
			//leave all rooms
			socket.leaveAll();
		});
		socket.on('status', function(content){
			var user = socket.user;
			if(user && user.id){
				var roomId = user.id;
				socket.in(roomId).emit('status',{from: user,content: content});
				//save status
				models.AccountMessage.add(user.id,user.id,user.username,user.avatar,'','','',content);
			}else{
				console.error('status error.');
			}
		});

		socket.on('leave a message', function(data){
			var user = socket.user;
			var to = data.to;
			var content = data.content;
			if(user && to && to.id){
				if(users[to.id]){
					var socketId = users[to.id].id;
					socket.in(socketId).emit('receive a message', {from: user, to: to, content: content});
					/** save message */
					models.AccountMessage.add(user.id,to.id,user.username,user.avatar,to.username,to.avatar,'',content);
				}
			}else{
				console.error('leave a message error.');
			}
		});

		socket.on('chat', function(data){
			var user = socket.user;
			var to = data.to;
			var content = data.content;
			if(user && to && to.id){
				if(users[to.id]){
					var socketId = users[to.id].id;
					socket.in(socketId).emit('chat',{from: user, to: to, content: content});
				}else{
					//TODO: save offline message
				}
			}else{
				console.error('chat error.');
			}
		});

		socket.on('project', function(data){
			var user = socket.user;
			var project = data.to;
			var content = data.content;
			if(user && project && project.id){
				var roomId = project.id;
				socket.in(roomId).emit('project',{from: user, to: project, content: content});
				/** save message */
				var message = {
						fromId: user.id,
						toId: project.id,
						fromUser: {
						},
						toUser: {
						},
						subject: '',
						content: content,
						tags: [],
						level: 0,
						good: 0,
						bad: 0,
						score: 0,
						createtime: new Date(),
					};
					message.fromUser[message.fromId] = {
						username: user.username,
						avatar: user.avatar
					};
					message.toUser[message.toId] ={
						username: '',
						avatar: ''
					};
					models.ProjectMessage.create(message,function(err,doc){
						if(err) return console.error(err);
					});
			}else{
				console.error('project error.');
			}
		});
	});

	//Deprecated!
	//create an event dispatcher
	// var events = require('events');
	// var eventDispatcher = new events.EventEmitter();
	// app.addEventListener = function(eventName, callback){
	// 		eventDispatcher.on(eventName,callback);
	// 	};
	// app.removeEventListener = function(eventName,callback){
	// 		eventDispatcher.removeListener(eventName,callback);
	// 	};
	// app.triggerEvent = function(eventName,eventOptions){
	// 		eventDispatcher.emit(eventName, eventOptions);
	// 	};	
	// sio.of('/v1').on('connection',function(socket){
	// 	var session = socket.handshake.headers.session;
	// 	var accountId = session.accountId;
	// 	var myAccount = null;
	// 	//进入 room
	// 	socket.join(accountId);
	// 	app.triggerEvent('event:' + accountId,{
	// 		from: accountId,
	// 		action: 'login'
	// 	});

	// 	var handleContactEvent = function(eventObj){
	// 			console.log('+++重要调试，检查Contact事件数量。To(用户名)：' + session.username);
	// 			console.log(eventObj);
	// 			socket.emit('contactEvent', eventObj);
	// 		};
			
	// 	var subscribeToAccount = function(accountId){
	// 			var eventName = 'event:' + accountId;
	// 			app.addEventListener(eventName,handleContactEvent);
	// 		};

	// 	var handleProjectEvent = function(eventObj){
	// 			console.log('+++重要调试，检查Project事件数量。To(用户名)：' + session.username);
	// 			socket.emit('projectEvent', eventObj);
	// 		};

	// 	var subscribeToProject = function(projectId){
	// 			var eventName = 'project:' + projectId
	// 			app.addEventListener(eventName, handleProjectEvent);
	// 		};

	// 	models.Account.findById(accountId,function(account){
	// 		var subscribedAccounts = {};
	// 		var subscirbedProjects = {};
	// 		if(account){
	// 			myAccount = account;
	// 			//订阅contact events
	// 			account.contacts = account.contacts || [];
	// 			account.contacts.forEach(function(contact){
	// 				if(!subscribedAccounts[contact.accountId]){
	// 					subscribeToAccount(contact.accountId);
	// 					subscribedAccounts[contact.accountId] = true;
	// 				}
	// 			});
	// 			//订阅自己account events
	// 			if(!subscribedAccounts[accountId]){
	// 				subscribeToAccount(accountId);
	// 				subscribedAccounts[accountId] = true;
	// 			}
	// 			//订阅project events
	// 			account.projects = account.projects || [];
	// 			account.projects.forEach(function(project){
	// 				if(!subscirbedProjects[project._id]){
	// 					subscribeToProject(project._id);
	// 					subscirbedProjects[project._id] = true;
	// 				}
	// 			});
	// 		}
	// 	});

	// 	socket.on('disconnect', function(){
	// 		if(myAccount){
	// 			myAccount.contacts = myAccount.contacts || [];
	// 			//退订 contanct events
	// 			myAccount.contacts.forEach(function(contact){
	// 				var eventName = 'event:' + contact.accountId;
	// 				app.removeEventListener(eventName, handleContactEvent);
	// 				// console.log('Unsubcribing from ' + eventName);
	// 			});
	// 			//退订 project events
	// 			myAccount.projects = myAccount.projects || [];
	// 			myAccount.projects.forEach(function(project){
	// 				var eventName = 'project:' + project._id;
	// 				app.removeEventListener(eventName, handleProjectEvent);
	// 			});
	// 			//退订 socket
	// 			// socket.removeListener('chatclient',recieveChat);
	// 			// socket.removeListener('projectclient');
	// 			//离开 room
	// 			// socket.leave(accountId);
	// 			//声明自己logout
	// 			app.triggerEvent('event:' + accountId,{
	// 				from: accountId,
	// 				action: 'logout'
	// 			});
	// 			//退订 accountId
	// 			var eventName = 'event:' + accountId;
	// 			app.removeEventListener(eventName, handleContactEvent);
	// 		}
	// 	});

	// 	var recieveChat = function(data){
	// 			console.log('chatclient:');
	// 			// console.log(data);
	// 			var from = accountId;
	// 			var to = data.to;
	// 			if(data.action == 'chat'){
	// 				models.AccountChat.add(from,to,{
	// 					username: session.username,
	// 					avatar: session.avatar,
	// 					status: data.text,
	// 				});
	// 			}
	// 			sio.sockets.in(data.to).emit('chatserver',{
	// 				from: accountId,
	// 				data: {
	// 					username: session.username,
	// 					avatar: session.avatar,
	// 					text: data.text
	// 				}
	// 			});
	// 		};
	// 	//receiving contact client
	// 	socket.on('chatclient', recieveChat);

	// 	//receiving project client 
	// 	socket.on('projectclient', function(data){
	// 		// console.log('+++')
	// 		// console.log(data)
	// 		var action = data.action; // 'chat'
	// 		var to = data.to;
	// 		var text = data.text;
	// 		var message = {
	// 				from: to,
	// 				data: {
	// 					userId: accountId,
	// 					username: session.username,
	// 					avatar: session.avatar,
	// 					text: text,
	// 				}
	// 			};
	// 		if(action == 'chat'){
	// 			models.ProjectMessage.add(accountId,to,session.username,session.avatar,'','','',text);
	// 			app.triggerEvent('project:' + to, message);
	// 		}
	// 	});
	// });
};