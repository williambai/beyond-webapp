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
			console.log('++++++')
			console.log(content)
			var user = socket.user;
			if(user && user.id){
				var roomId = user.id;
				socket.in(roomId).emit('status',{from: user,content: content});
				/** save status */
				var message = {
						fromId: user.id,
						toId: user.id,
						fromUser:{},
						toUser:{},
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
				models.AccountMessage.create(message,function(err,doc){
					if(err) return console.error(err);
				});
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
					var message = {
							fromId: user.id,
							toId: to.id,
							fromUser:{},
							toUser:{},
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
							username: to.username,
							avatar: to.avatar
						};
					models.AccountMessage.create(message,function(err,doc){
						if(err) return console.error(err);
					});
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
					models.ProjectStatus.create(message,function(err,doc){
						if(err) return console.error(err);
					});
			}else{
				console.error('project error.');
			}
		});
	});
};