var Backbone = require('backbone');
var config = require('../conf');

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
});