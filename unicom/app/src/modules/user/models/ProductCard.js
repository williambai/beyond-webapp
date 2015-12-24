var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/channel/product/cards',	

	validation: {
		'customer[name]': {
			minLength: 2,
			msg: '请输入客户姓名'
		},
		'customer[phone]': {
			minLength: 6,
			msg: '请输入客户正确的电话号码'			
		}
	},
});