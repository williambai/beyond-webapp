var mongoose = require('mongoose');
var connection = mongoose;
var _ = require('underscore');

var schema = new mongoose.Schema({
		name: String,
		description: String,
		username: String,
		password: String,
		email: String,
		mobile: String,
	});

schema.set('collection','members');


/**
 * 注册
 * @param  {[type]}   input [description]
 * @param  {Function} done   [description]
 * @return {[type]}          [description]
 */
schema.statics.register = function(input,done){
	var Member = connection.model('Member');
	var member = new Member(input);
	member.save(function(err){
		done(err,member);
	});
};

/**
 * 登录
 * @param  {[type]}   input [description]
 * @param  {Function} done  [description]
 * @return {[type]}         [description]
 */
schema.statics.login = function(input,done){
	var Member = connection.model('Member');
	Member.find({
		username: input.username,
		password: input.password,
	}, function(err,doc){
		if(err) return done(err);
		if(!doc) return done({code: 40411, errmsg: '用户不存在'});
		doc = _.pick(doc,'_id','name');
		done(null,doc);
	});
};

/**
 * 修改密码
 * @param  {[type]}   input [description]
 * @param  {Function} done  [description]
 * @return {[type]}         [description]
 */
schema.statics.changePass = function(input,done){
	var Member = connection.model('Member');
	Member.findByIdAndUpdate(
		input._id,
		{
			$set: {
				password: input.password || 'qweerrt',
			}
		},
		{
			'upsert': false,
			'new': true,
		},
		function(err,doc){
			if(err) return done(err);
			if(!doc) return done({code: 40412, errmsg: '用户不存在'});
			done(null, doc);
		});
};

/**
 * 更新个人注册信息
 * @param  {[type]}   input [description]
 * @param  {Function} done  [description]
 * @return {[type]}         [description]
 */
schema.statics.updateProfile = function(input,done){
	var Member = connection.model('Member');
	var set = input || {};
	set = _.omit(set,'_id','password');
	Member.findByIdAndUpdate(
		input._id,
		{
			$set: set,
		},
		{
			'upsert': false,
			'new': true,
		},
		function(err,doc){
			if(err) return done(err);
			if(!doc) return done({code: 40413, errmsg: '用户不存在'});
			doc = _.omit(doc, 'password');
			done(null, doc);
		});
};

module.exports = exports = function(conn) {
	connection = conn || mongoose;
	return connection.model('Member', schema);
};
