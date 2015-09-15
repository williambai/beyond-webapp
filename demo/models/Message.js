/**
 * params: content [text | json object]
 * MsgType:[text|image|vioce|video|shortvideo|location|moreimage]
 *
 * JSON Object MUST HAS:
 * 
 * {
 *    MsgType:'text',
 *    CreateTime:
 *    Content:
 * }
 * {
 *    MsgType:'image',
 *    CreateTime:
 *    Url:
 * }
 * {
 *    MsgType:'mixed',
 *    CreateTime:
 *    Content:
 *    Urls:[]
 * }
 * {
 *    MsgType:'link',
 *    CreateTime:
 *    Title:
 *    Description:
 *    Url:
 * }
 * {
 *    MsgType:'voice',
 *    CreateTime:
 *    Url:
 *    Format:[amr,speex]
 * }
 * {
 *    MsgType:'shortvideo',
 *    CreateTime:
 *    Url:
 *    ThumbUrl:
 * }
 * {
 *    MsgType:'video',
 *    CreateTime:
 *    Url:
 *    ThumbUrl:
 * }
 * {
 *    MsgType:'location',
 *    CreateTime:
 *    Location_X:
 *    Location_Y:
 *    Scale:
 *    Label:
 * }
 * {
 * 	  MsgType: 'email',
 * 	  CreateTime:
 * 	  From:
 * 	  To:
 * 	  CC:
 * 	  Subject:
 * 	  Url:
 * }
 * 
 * -- OR --
 * 
 * String: display directly
 */
var Message = {};

Message.schema = {
	fromId: {type: String},
	toId: {type:String},//accountId or projectId
	fromUser: {},//fromId => username,avatar
	toUser: {},// toId => username,avatar
	subject: {type: String},
	content: {},
	tags: [],
	comments: [],//accountId,username,comment
	level: {type: Number}, // important index: 0~100
	voters:[],//accountId
	votes: [],//accountId,username,vote(good or bad)
	good: {type: Number},
	bad: {type: Number},
	score: {type: Number},
	createtime: {type: Date}

	// username: {type: String}, //!deprecated
	// avatar: {type: String}, //!deprecated
	// status: {},//!deprecated body, SEE ABOVE
};

// Message.prototype.debug = true;
// Message.prototype.defaultCallback = function(err){
// 		if(err){
// 			return console.log(err);
// 		}
// 		return console.log('Message Save/Remove/Update successfully.');
// 	};

// Message.prototype.add = function(fromId,toId,fromUsername,fromAvatar,toUsername,toAvatar,subject,content,callback){
// 	var fromUser = {};
// 	var toUser = {};
// 	if(!fromId || !toId){
// 		throw new Error('fromId or toId can not be undefined.');
// 		return;
// 	}
// 	fromUser[fromId] = {
// 		username: fromUsername || '',
// 		avatar: fromAvatar || ''
// 	};
// 	toUser[toId] = {
// 		username: toUsername || '',
// 		avatar: toAvatar || ''
// 	};
// 	var message = new this.model({
// 			fromId: fromId,
// 			toId: toId,
// 			fromUser: fromUser,
// 			toUser: toUser,
// 			subject: subject || '',
// 			content: content || '',
// 			tags: [],
// 			level: 0,
// 			good: 0,
// 			bad: 0,
// 			score: 0,
// 			createtime: new Date(),
// 		});
// 	message.save(function(err){
// 		this.debug && this.defaultCallback(err);
// 		if(err){
// 			callback && callback(null);
// 		}else{
// 			callback && callback(message);
// 		}
// 	});
// };

// Message.prototype.remove = function(id,callback){
// 	this.model
// 		.findByIdAndRemove(
// 			id, 
// 			function(err){
// 				this.debug && this.defaultCallback(err);
// 				if(err){
// 					callback && callback(null);
// 				}else{
// 					callback && callback(true);
// 				}
// 			}
// 		);
// };

// Message.prototype.updateAvatar = function(id,avatar,callback){
// 	this.model
// 		.findByIdAndUpdate(
// 			id,
// 			{
// 				avatar: avatar
// 			},
// 			function(err, result){
// 				this.debug && this.defaultCallback(err);
// 				if(err || !result){
// 					callback && callback(false);
// 				}else{
// 					callback && callback(true);
// 				}
// 			}
// 		);
// };

// Message.prototype.updateVoteGood = function(id,accountId,voterUsername,callback){
// 	this.model.findOneAndUpdate(
// 		{
// 			 _id: id,
// 			voters: {$nin: [accountId]}
// 		},
// 		{
// 			$push: {
// 				voters: accountId, 
// 				votes: {
// 					accountId: accountId,
// 					username: voterUsername,
// 					vote: 'good'
// 				}
// 			},
// 			$inc: {good: 1, score: 1}
// 		},
// 		function(err,result){
// 			this.debug && this.defaultCallback(err);
// 			if(err || !result){
// 				callback && callback(false);
// 			}else{
// 				callback && callback(true);
// 			}
// 		}
// 	);			
// };

// Message.prototype.updateVoteBad = function(id,accountId,voterUsername,callback){
// 	this.model
// 		.findOneAndUpdate(
// 			{
// 				_id: id,
// 				voters: {$nin: [accountId]}
// 			},
// 			{
// 				$push: {
// 					voters: accountId, 
// 					votes: {
// 						accountId: accountId,
// 						username: voterUsername,
// 						vote: 'bad'
// 					}
// 				},
// 				$inc: {bad: 1, score: -1}
// 			},
// 			function(err, result){
// 				this.debug && this.defaultCallback(err);
// 				if(err || !result){
// 					callback && callback(false);
// 				}else{
// 					callback && callback(true);
// 				}
// 			}
// 		);
// };

// Message.prototype.updateLevel = function(id,level,callback){
// 	this.model
// 		.findByIdAndUpdate(
// 			id,
// 			{
// 				level: level
// 			},
// 			function(err,result){
// 				this.debug && this.defaultCallback(err);
// 				if(err || !result){
// 					callback && callback(false);
// 				}else{
// 					callback && callback(true);
// 				}
// 			}
// 		);
// };

// Message.prototype.addComment = function(id,accountId,username,comment,callback){
// 	this.model
// 		.findOneAndUpdate(
// 			{
// 				_id: id,
// 			},
// 			{
// 				$push: {
// 					comments: {
// 						accountId: accountId,
// 						username: username,
// 						comment: comment
// 					}
// 				}
// 			},
// 			function(err,result){
// 				this.debug && this.defaultCallback(err);
// 				if(err || !result){
// 					callback && callback(false);
// 				}else{
// 					callback && callback(true);
// 				}
// 			}
// 		);
// };

// Message.prototype.getActivityById = function(accountId, contactIds, page, callback){
// 	var per = 20;
// 	if(typeof page == 'function'){
// 		callback = page;
// 		page = 0;
// 	}
// 	if(!callback){
// 		throw new Error('callback is not defined.');
// 	}
// 	var pairs = [];
// 	contactIds.forEach(function(contantId){
// 		pairs.push({
// 			fromId: contantId,
// 			toId: contantId
// 		});
// 	});

// 	pairs.push({
// 			toId: accountId,
// 			fromId: accountId 
// 		});

// 	this.model
// 		.find({})
// 		.or(pairs)
// 		.sort({createtime:-1})
// 		.skip(page*per)
// 		.limit(per)
// 		.exec(function(err,docs){
// 			this.debug && this.defaultCallback(err);
// 			if(err){
// 				callback && callback(null);
// 			}else{
// 				callback && callback(docs);
// 			}
// 		});
// };


// Message.prototype.getStatusById = function(accountId,page,callback){
// 	var per = 20;
// 	if(typeof page == 'function'){
// 		callback = page;
// 		page = 0;
// 	}
// 	if(!callback){
// 		throw new Error('callback is not defined.');
// 	}
// 	this.model
// 		.find({toId: accountId, fromId: accountId})
// 		.sort({createtime:-1})
// 		.skip(page*per)
// 		.limit(per)
// 		.exec(function(err,docs){
// 			this.debug && this.defaultCallback(err);
// 			if(err){
// 				callback && callback(null);
// 			}else{
// 				callback && callback(docs);
// 			}
// 		});
// };

// Message.prototype.getExchangeById = function(accountId,contactIds,page,callback){
// 	var per = 20;
// 	if(typeof page == 'function'){
// 		callback = page;
// 		page = 0;
// 	}
// 	if(!callback){
// 		throw new Error('callback is not defined.');
// 	}

// 	this.model
// 		.find({})
// 		.or([
// 			{
// 				toId: accountId,
// 				fromId: {$in: contactIds} 
// 			},
// 			{
// 				fromId: accountId,
// 				toId: {$in: contactIds} 
// 			}
// 		])
// 		.sort({createtime:-1})
// 		.skip(page*per)
// 		.limit(per)
// 		.exec(function(err,docs){
// 			this.debug && this.defaultCallback(err);
// 			if(err){
// 				callback && callback(null);
// 			}else{
// 				callback && callback(docs);
// 			}
// 		});
// };

// Message.prototype.getAllByToId = function(toId,page,callback){
// 	var per = 20;
// 	if(typeof page == 'function'){
// 		callback = page;
// 		page = 0;
// 	}
// 	if(!callback){
// 		throw new Error('callback is not defined.');
// 	}
// 	this.model
// 		.find({toId:toId})
// 		.sort({createtime:-1})
// 		.skip(page*per)
// 		.limit(per)
// 		.exec(function(err,docs){
// 			this.debug && this.defaultCallback(err);
// 			if(err){
// 				callback && callback(null);
// 			}else{
// 				callback && callback(docs);
// 			}
// 		});
// };

// Message.prototype.getAllByFromId = function(fromId,page,callback){
// 	var per = 20;
// 	if(typeof page == 'function'){
// 		callback = page;
// 		page = 0;
// 	}
// 	if(!callback){
// 		throw new Error('callback is not defined.');
// 	}

// 	this.model
// 		.find({fromId: fromId})
// 		.sort({createtime:-1})
// 		.skip(page*per)
// 		.limit(per)
// 		.exec(function(err,docs){
// 			this.debug && this.defaultCallback(err);
// 			if(err){
// 				callback && callback(null);
// 			}else{
// 				callback && callback(docs);
// 			}
// 		});
// };

exports = module.exports = Message;