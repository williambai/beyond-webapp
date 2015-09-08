var Backbone = require('backbone');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',
	defaults: {
		roles: {
			admin: false,
			agent: false,
			user: true,
			app: false,
		},
		business: {
			stage: 'test',
			types: {
				verify: false,
				base: false,
				whole: false
			},
			times: {
				verify: 0,
				vase: 0,
				whole: 0
			},
			limit: -1,
			expired: new Date()
		},
		app: {
			app_id: '',
			app_secret: '',
			apis: {
				verify: false,
				base: false,
				whole: false
			}
		},
		balance: 0,
		enable: true,
	},

});