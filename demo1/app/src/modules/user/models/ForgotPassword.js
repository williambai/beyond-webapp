var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	
	url: config.api.host + '/forgotPassword',

	validate: function(attrs, options){
		var errors = [];
		if(!( /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(attrs.email))){
			errors.push({
				name: 'email',
				message: '不是有效的电子邮件',
			});
		}

		if(!_.isEmpty(errors)) return errors;
	},
});