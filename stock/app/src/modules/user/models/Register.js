var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	url: config.api.host + '/register',

	validate: function(model, options){
		var errors = [];
		if(!/^([a-zA-Z0-9_-])+$/.test(model.username)){
			errors.push({
				name: 'username',
				message: '用户名不合法'
			});
		}
		if(!( /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(model.email))){
			errors.push({
				name: 'email',
				message: '不是有效的电子邮件'
			});
		}
		if(model.password.length < 5){
			errors.push({
				name: 'password',
				message: '密码长度不正确'
			});
		}
		if(model.cpassword != model.password){
			errors.push({
				name: 'cpassword',
				message: '两次输入不一致'
			});
		}
		if(!_.isEmpty(errors)) return errors;
	},
});