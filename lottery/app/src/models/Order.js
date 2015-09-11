var Backbone = require('backbone');
var _ = require('underscore');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',
	defaults: {
		customer: {
			email: '',
			username: '',
		},
		game: {
			ltype: "QGSLTO",
			periods: 1,
			playtype: 1,
			content: '',
			sms: '',
		},
		lottery_cost: 0,
		sms_cost: 0,
		total_cost: 0,
	},
	
	url: '/orders',

	validate: function(attrs,options){
		var errors = {};
		var customer = attrs.customer;
		if(customer.username.length<1){
			errors.username = '用户名不能为空';
		}
		if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(customer.email))){
			// errors.email = '不是有效的手机号码';
		}

		return _.isEmpty(errors) ? null : errors;
	},
});