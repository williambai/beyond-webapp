var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	
	url: config.api.host + '/resetPassword',

	validate: function(attrs, options){
		var errors = [];

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