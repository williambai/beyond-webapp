var Backbone = require('backbone');
var config = require('../conf');
var _ = require('underscore');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',
	url: config.api.host + '/account/statuses',
	defaults: {
		username: '',
		avatar: '',
		level: 0,
		good: 0,
		bad: 0,
		score: 0,
	},
	validate: function(attrs, options) {
		var content = attrs.content;
		var errors = [];
		if (content instanceof Object && _.isEmpty(content.urls) &&
			_.isEmpty(content.body) && content.body.length < 5) {
			errors.push({
				name: 'text',
				message: '内容太少了，多写点。。。',
			});
		}
		if (!_.isEmpty(errors)) return errors;
	},

});