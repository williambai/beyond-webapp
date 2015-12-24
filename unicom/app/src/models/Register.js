var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	url: config.api.host + '/register',

	validation: {
		username: {
			required: true,
	    	minLength: 5,
	    	msg:'用户名不合法'
		},
		email: {
	      required: true,
	      pattern: 'email',
	      msg: '请输入有效的电子邮件'
	    },
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
});