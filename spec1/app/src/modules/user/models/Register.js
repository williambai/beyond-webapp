var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	url: config.api.host + '/register',
	// defaults: {
	// 	username: '',
	// 	email: '',
	// 	password:'',
	// 	cpassword: '',
	// },

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
		if(attrs.password.length < 5){
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