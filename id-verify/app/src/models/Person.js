var Backbone = require('backbone');

exports = module.exports = Backbone.Model.extend({

	defaults: {
		card_id: '',
		card_name: '',
		content: {
			rts: []
		},
	},
});