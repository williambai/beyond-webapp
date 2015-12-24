var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	
	url: config.api.host + '/resetPassword',

	validation: {
	    password: {
			required: true,
	    	minLength: 5,
	    	msg:'密码长度至少五位'
	    },
	    // cpassword: function(val,attr,complateState){
	    // 	console.log(complateState)
	    // 	var password = complateState.password;
	    // 	if(val != password) return '两次输入不一致';
	    // },
	},
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