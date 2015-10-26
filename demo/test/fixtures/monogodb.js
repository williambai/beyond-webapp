var _ = require('underscore');
var async = require('async');
var crypto = require('crypto');
var mongoose = require('mongoose');
var ObjectID = require('mongodb').ObjectID;
var config = {
		db: require('../../config/db')
	};		

//app emulator
var app = {
	isAccountOnline: function(accountId){
		return false;
	}
};

//import the models
var models = {
		Account: require('../../models/Account')(app,mongoose),
		AccountNotification: require('../../models/AccountNotification')(app,mongoose),
		AccountActivity: require('../../models/AccountActivity')(app,mongoose),
		AccountChat: require('../../models/AccountChat')(app,mongoose),
		AccountFriend: require('../../models/AccountFriend')(app,mongoose),
		AccountMessage: require('../../models/AccountMessage')(app,mongoose),
		ProjectAccount: require('../../models/ProjectAccount')(app,mongoose),
		AccountRoom: require('../../models/AccountRoom')(app,mongoose),
		AccountStatus: require('../../models/AccountStatus')(app,mongoose),

		Room: require('../../models/Room')(app,mongoose),
		RoomChat: require('../../models/RoomChat')(app,mongoose),

		Project: require('../../models/Project')(app,mongoose),
		ProjectStatus: require('../../models/ProjectStatus')(app,mongoose),

	};

config.db.URI = 'mongodb://localhost/demo2';

mongoose.connect(config.db.URI,function onMongooseError(err){
	if(err) {
		console.error('Error: can not open Mongodb.');
		throw err;
	}
});

/**
 * 准备数据
 * 
 */
var avatar = [
	'upload/1433476695765.jpg',
	'upload/1433489948391.jpg',
	'upload/1435739478908.jpg',
];

var users = [];

for(var i=100; i< 200; i++){
	users.push({
		_id: new ObjectID(),
		email: 'pdb' + i + '@pdbang.cn',
		password: crypto.createHash('sha256').update('123456').digest('hex'),
		username: 'real_pdb' + i,
		birthday: {
			day: 20,
			month: 5,
			year: 1980
		},
		biography: '万达，是一个地地道道的土豪。成立于1988年，已经涉足商业地产、高级酒店、文化旅游和连锁百货四大核心产业。最新资料显示，万达在全国已经有100多座万达广场，50多家五星级酒店和142家五星级影院。就是这样一个商业大鳄，屡次梦断电商，让人唏嘘不已。',
		avatar: avatar[i%4] || '',
		status: {
			code: 0,
			message: '正常'
		}
	});
}

for(var i=100; i< 200; i++){
	users.push({
		_id: new ObjectID(),
		email: 'test' + i + '@test.cn',
		password: crypto.createHash('sha256').update('123456').digest('hex'),
		username: 'real_test' + i,
		birthday: {
			day: 20,
			month: 5,
			year: 1980
		},
		biography: '',
		avatar: avatar[i%4] || '',
		status: {
			code: 0,
			message: '正常'
		}
	});
}
/**
 * 清除数据
 * 
 */
var dropCollections = function(done){
	async.series(
		[
			function(callback){
				models.AccountNotification.remove(callback);
			},
			function(callback){
				models.ProjectStatus.remove(callback);
			},
			function(callback){
				models.Project.remove(callback);
			},
			function(callback){
				models.ProjectAccount.remove(callback);
			},
			function(callback){
				models.AccountChat.remove(callback);
			},
			function(callback){
				models.AccountMessage.remove(callback);
			},
			function(callback){
				models.AccountActivity.remove(callback);
			},
			function(callback){
				models.AccountStatus.remove(callback);
			},
			function(callback){
				models.AccountFriend.remove(callback);
			},
			function(callback){
				models.Account.remove(callback);
			},
		],
		function(err, result){
			if(err) return done(err);
			done(null);
		}
	);

};


/**
 * 
 * create Account and AccountActivity
 * 
 */
var upsertAccounts = function(callback){
		var upsertAccount = function(index){
				var user = users[index];
				var clone = _.clone(user);
				models.Account.create(
					user,
					function(err,result){
						if(err) return callback(err);
						models.AccountActivity
							.findOneAndUpdate(
								{
									uid: user._id
								},
								{
									$set: {
										uid: user._id,
										statuses: [],
										lastupdatetime: new Date()
									}
								},
								{
									upsert: true
								},
								function(err){
									index++;
									if(!users[index]) return callback(null);
									upsertAccount(index);
								}
							);
					}
				);
			};
		upsertAccount(0);
	};

/**
 * users[0]有 users[1]...users[99] 好友
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
var upsertFriends = function(callback){
		var upsertFriend = function(index){
				var user = users[index];
				var message;
				if(i%4 == 0){
					message = 'status 0';
				}else if(i%4 == 1){
					message = 'status 1';
				}else if(i%4 == 2){
					message = 'status 2';
				}else{
					message = 'status unkown';
				}
				models.AccountFriend.findOneAndUpdate(
					{
						uid: users[0]._id,
						fid: user._id
					},
					{
						username: user.username,
						avatar: user.avatar,
						status: {
							code: index%4,
							message: message,
						},
						histories: [],
						lastupdatetime: new Date()
					},
					{
						upsert: true
					},
					function(err, result){
						if(err) return callback(err);
						index ++;
						if(index > 99) return callback(null);
						upsertFriend(index);
					}
				);	
			}
		upsertFriend(1);
	};

var messages = require('./messages');

var upsertAccountStatuses = function(callback){
		var upsertStatus = function(index){
				var user = users[index%5];
				var commentUser = users[1];
				var replyUser = users[2];
				var msg = messages[index%10] || {};
				var message = {
					uid: user._id,
					username: user.username,
					avatar: user.avatar,
					subject: '',
					type: msg.type || 'text',
					content: msg.content || {body: '这是第 '+ index +' 条消息'},
					tags: [],
					comments: [{
						uid: commentUser._id,
						username: commentUser.username,
						avatar: commentUser.avatar,
						content: 'this is '+ index +' comments....',
						replies: [{
							uid: replyUser._id,
							username: replyUser.username,
							avatar: replyUser.avatar,
							content: 'this is ' + index + ' reply....',
						}]
					}],
					weight: parseInt(Math.random()*100), 
					voters:[
						users[3]._id,users[4]._id,users[5]._id,
					],
					votes: [
						{
							uid: users[3]._id,
							username: users[3].username,
							vote: 'good',
						},
						{
							uid: users[4]._id,
							username: users[4].username,
							vote: 'bad',
						},
						{
							uid: users[5]._id,
							username: users[5].username,
							vote: 'good',
						}
					],
					good: 2,
					bad: 1,
					score: 1,
					lastupdatetime: new Date()					
				};
				async.waterfall(
					[
						function(callback){
							models.AccountStatus.create(message, callback);
						},
						function(message,callback){
							models.AccountFriend
								.find(
									{
										uid: users[0]._id									
									},
									function(err,friends){
										if(err) return callback(err);
										if(_.isEmpty(friends))
											return callback(null,{
												message: message,
												fids: [users[0]._id]
											});
										var fids = _.pluck(friends,'fid');
										fids.push(users[0]._id);
										callback(null,{
											message: message,
											fids: fids
										});
									}
								);
						},
						function(object,callback){
							var message = object.message;
							var fids = object.fids;
							models.AccountActivity
								.update(
									{
										uid: {
											$in:  fids,
										},
									},
									{
										$push: {
											statuses: {
												$each: [message._id],
												$slice: -400,
											}
										}
									},
									{
										upsert: true,
										multi: true,
									},
									callback
								);
						},
					],
					function(err,result){
						if(err) return callback(err);
						index++;
						if(index>200) return callback(null);
						upsertStatus(index);
					}
				)
			};
		upsertStatus(0);
	};

var upsertAccountMessages = function(callback){
		upsertMessage = function(index){
			var user1 = {
					uid: (users[0]._id).toString(),
					username: users[0].username,
					avatar: users[0].avatar,
				};

			var user2 = {
					uid: (users[1]._id).toString(),
					username: users[1].username,
					avatar: users[1].avatar,
				};
			var msg = messages[index%10] || {};
			var message = {
					from: index%2 ? user1 : user2,
					to: index%2 ? user2 : user1,
					subject: '',
					type: msg.type || 'text',
					content: msg.content || {body: '这是第 '+ index +' 条私信'},
					tags: [],
					comments: [{
						uid: user1._id,
						username: user1.username,
						avatar: user1.avatar,
						content: 'this is '+ index +' comments....',
						replies: [{
							uid: user2._id,
							username: user2.username,
							avatar: user2.avatar,
							content: 'this is ' + index + ' reply....',
						}]
					}],
					weight: parseInt(Math.random()*100), 
					lastupdatetime: new Date()					
				};
			models.AccountMessage.create(message,function(err){
				if(err) return callback(err);
				index++;
				if(index>200) return callback(null);
				upsertMessage(index);
			});
		};
		upsertMessage(0);
	};

var pid;

var upsertProjects = function(callback){
		var upsertProject = function(index){
				var user = users[index%2];
				var project = {
					name: '项目 ' + index + ' 名称',
					description: '这是项目 '+ index + ' 的描述.....',
					members: 6,
					createby: {
						uid: user._id,
						username: user.username,
						avatar: user.avatar,
					},
					status: {
						code: 0,
						message: '正常'
					},
					lastupdatetime: new Date(),
				};
				models.Project.create(project, function(err,project){
					if(err) return callback(err);
					if(index == 0) pid = (project._id).toString();
					models.ProjectAccount.create(
						[
							{
								uid: (user._id).toString(),//account id
								username: user.username,
								avatar: user.avatar,
								pid: (project._id).toString(),//project id
								roles: ['presenter'], //0:参与; 1:主持
								notification: true, //通知提醒，true: 接收；false: 拒绝
								status: {
									code: 0,//0: 正常；1: 待确认；-1: 拒绝/不显示
									message: '正常',
								},
								lastupdatetime: new Date(),
							},
							{
								uid: (users[(index+1)%2]._id).toString(),
								username: users[(index+1)%2].username,
								avatar: users[(index+1)%2].avatar,
								pid: (project._id).toString(),
								roles: ['attendee'], 
								notification: true,
								status: {
									code: 0,
									message: '正常',
								},
								lastupdatetime: new Date(),
							},
							{
								uid: (users[2]._id).toString(),
								username: users[2].username,
								avatar: users[2].avatar,
								pid: (project._id).toString(),
								roles: ['attendee'], 
								notification: true,
								status: {
									code: 0,
									message: '正常',
								},
								lastupdatetime: new Date(),
							},
							{
								uid: (users[3]._id).toString(),
								username: users[3].username,
								avatar: users[3].avatar,
								pid: (project._id).toString(),
								roles: ['attendee'], 
								notification: true,
								status: {
									code: 0,
									message: '正常',
								},
								lastupdatetime: new Date(),
							},
							{
								uid: (users[4]._id).toString(),
								username: users[4].username,
								avatar: users[4].avatar,
								pid: (project._id).toString(),
								roles: ['attendee'], 
								notification: true,
								status: {
									code: 0,
									message: '正常',
								},
								lastupdatetime: new Date(),
							},
							{
								uid: (users[5]._id).toString(),
								username: users[5].username,
								avatar: users[5].avatar,
								pid: (project._id).toString(),
								roles: ['attendee'], 
								notification: true,
								status: {
									code: 0,
									message: '正常',
								},
								lastupdatetime: new Date(),
							}
						],
						function(err){
							if(err) return callback(err);
							index ++;
							if(index>30) return callback(null);
							upsertProject(index);
						}
					);
				});
			};
		upsertProject(0);
	};

var upsertProjectStatuses = function(callback){
		var upsertProjectStatus = function(index){
				var user = users[index%3];
				var msg = messages[index%10] || {};
				var message = {
						pid: pid,//project id
						createby: {
							uid: (user._id).toString(),
							username: (user.username).toString(),
							avatar: (user.avatar).toString(),
						},
						subject: '',
						type: msg.type || 'text',
						content: msg.content || {body: '这是第 '+ index +' 条 project status'},
						tags: [],
						comments: [{
							uid: user._id,
							username: user.username,
							avatar: user.avatar,
							content: 'this is '+ index +' comments....',
							replies: [{
								uid: users[2]._id,
								username: users[2].username,
								avatar: users[2].avatar,
								content: 'this is ' + index + ' reply....',
							}]
						}],
						weight: parseInt(Math.random()*100), 
						voters:[
							users[3]._id,users[4]._id,users[5]._id,
						],
						votes: [
							{
								uid: users[3]._id,
								username: users[3].username,
								vote: 'good',
							},
							{
								uid: users[4]._id,
								username: users[4].username,
								vote: 'bad',
							},
							{
								uid: users[5]._id,
								username: users[5].username,
								vote: 'good',
							}
						],
						good: 2,
						bad: 1,
						score: 1,
						lastupdatetime: new Date()				
					};	
					models.ProjectStatus.create(message,function(err){
						if(err) return callback(err);
						index ++;
						if(index>500) return callback(null);
						upsertProjectStatus(index);
					});		
			};
		upsertProjectStatus(0);	
	};

upsertAccountNotifications = function(callback){
	var upsertAccountNotification = function(index){
			var friend = users[index];
			var notification = {
					uid: users[0]._id,
					createby: {
						uid: friend._id,
						username: friend.username,
						avatar: friend.avatar
					},
					type: 'invite',
					content: {
						subject: '好友邀请',
						body: friend.username + '邀请你为好友',
					},
					actions: [
						{
							name: 'agree',
							url: '/friends/account/me/' + friend._id + '?type=agree',
							method: 'PUT',
							label: '接受',
							enable: true
						}
					],
					status: {
						code: 0,
						message: '等待处理'
					},
				};
			models.AccountNotification.create(notification, function(err){
				if(err) return callback(err);
				index ++;
				if(index>100) return callback(null);
				upsertAccountNotification(index);
			});

		};
	upsertAccountNotification(0);
};

async.waterfall(
	[
		dropCollections,
		upsertAccounts,
		upsertFriends,
		upsertAccountStatuses,
		upsertAccountMessages,
		upsertProjects,
		upsertProjectStatuses,
		upsertAccountNotifications,
	],
	function(err,result){
		if(err) console.log(err);
		mongoose.disconnect();
	}
);


