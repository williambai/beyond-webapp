var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',
	initialize: function(options){
		this.url = config.api.host + '/account/messages';
	},
	defaults: {
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