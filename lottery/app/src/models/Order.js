var Backbone = require('backbone');

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
		},
		lottery_cost: 0,
		sms_cost: 0,
		total_cost: 0,
	},
	url: '/orders',
});