var _ = require('underscore');
var Backbone = require('backbone');
var StatusCollection = require('./StatusCollection');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',

	url: config.api.host + '/accounts',

	defaults: {
		email: '',
		password:'',
		username: '',
		realname: '',
		avatar: '',
		biography: '',
		status: {},
	},

	initialize: function(){
		this.status = new StatusCollection();
		this.status.url = config.api.host + '/accounts' + this.id + '/status';
		this.activity = new StatusCollection();
		this.activity.url = config.api.host + '/accounts' + this.id + '/activity';
	},

	validate: function(attrs, options){
		var errors = [];
		if(!/^([a-zA-Z0-9_-])+$/.test(attrs.username)){
			errors.push({
				name: 'username',
				message: '用户名不合法'
			});
		}
		if(!( /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(attrs.email))){
			errors.push({
				name: 'email',
				message: '不是有效的电子邮件'
			});
		}
		if(!_.isEmpty(attrs.password) && attrs.password.length < 5){
			errors.push({
				name: 'password',
				message: '密码长度不正确'
			});
		}
		if(attrs.cpassword != attrs.password){
			errors.push({
				name: 'cpassword',
				message: '两次输入不一致'
			});
		}
		if(!_.isEmpty(errors)) return errors;
	},	
});
