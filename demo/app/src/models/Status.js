var Backbone = require('backbone');
exports = module.exports = Backbone.Model.extend({
	defaults: {
		username: '',
		avatar: '',
		level: 0,
		good: 0,
		bad: 0,
		score: 0,
	},
});