var mongoose = require('mongoose');
var connection = mongoose;
var _ = require('underscore');
var uuid = require('node-uuid');

var schema = new mongoose.Schema({
		name: String, //** 应用名称
		description: String, //** 应用描述
		aid: String, //** id
		key: String, //** key
		secret: String, //** secret
		domain: String, //** domain 域名
		callback_url: String, //** callback_url 目的是创建 {refresh_token,access_token}，再可以调用/refresh异步接收
		creator: {
			id: String,
			name: String,
		},
		grant: {}, //** app_grant 授权
	});

schema.set('collection','applications');

/**
 * 新增
 * @param {[type]}   input [description]
 * @param {Function} done  [description]
 */
schema.statics.add = function(input,done){
	var Member = connection.model('Member');
	var Application = connection.model('Application');
	var application = new Application(input);
	application.secret = uuid.v4();
	application.key = application.secret.slice(0,8);
	var creator = (input && input.creator) || {};
	Member.findById(creator.id, function(err,member){
		if(err) return done(err);
		if(!member) return done({code: 40415, errmsg: '用户不存在'});
		application.save(function(err){
			done(err,application);
		});
	});
};

/**
 * 获取指定用户的所有应用
 * @param  {[type]}   input   [description]
 * @param  {[type]}   options [description]
 * @param  {Function} done    [description]
 * @return {[type]}           [description]
 */
schema.statics.getAppsByMemberId = function(input,options,done){
	options = options || {};
	var per = options.per || 10;
	var page = (!options.page || options.page < 0) ? 0 : options.page;
	var Application = connection.model('Application');
	Application
		.count({
			'creator.id': input.id
		}, function(err,total){
			Application
				.find({
					'creator.id': input.id
				})
				.skip(per*page)
				.limit(per)
				.exec(function(err,docs){
					if(err) return done(err);
					done(null,{
						total: total,
						page: page,
						per: per,
						collection: docs
					});
				});
		});
};

/**
 * 更新Key和Secret
 * @param  {[type]}   input [description]
 * @param  {Function} done  [description]
 * @return {[type]}         [description]
 */
schema.statics.updateKeyAndSecretById = function(input,done){
	var Application = connection.model('Application');
	var secret = uuid.v4();
	var set = {
		key: secret.slice(0,8),
		secret: secret,
	};
	Application
		.findByIdAndUpdate(
			input.id
			,{
				$set: set,
			},{
				'upsert': false,
				'new': true,
			},function(err,doc){
				if(err) return done(err);
				done(null,doc);
			});
};

/**
 * 更新基本信息
 * @param  {[type]}   input [description]
 * @param  {Function} done  [description]
 * @return {[type]}         [description]
 */
schema.statics.updateBaseInfoById = function(input,done){
	var Application = connection.model('Application');
	var secret = uuid.v4();
	var set = _.pick(input,'name','description','domain','callback_url','grant');
	Application
		.findByIdAndUpdate(
			input.id
			,{
				$set: set,
			},{
				'upsert': false,
				'new': true,
			},function(err,doc){
				if(err) return done(err);
				done(null,doc);
			});
};

module.exports = exports = function(conn) {
	connection = conn || mongoose;
	return connection.model('Application', schema);
};
