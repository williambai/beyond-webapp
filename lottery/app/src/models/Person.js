var Backbone = require('backbone');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',
	defaults: {
		card_id: '',
		card_name: '',
		content: {
			rts: []
		},
	},
});