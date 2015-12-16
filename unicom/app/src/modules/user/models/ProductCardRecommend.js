var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/card/recommends',	

	validation: {
		'customer[name]': {
			minLength: 2,
			msg: '用户名不合法'
		},
		'customer[cardno]': {
			minLength: 10,
			msg: '身份证号不正确'			
		}
	},
});