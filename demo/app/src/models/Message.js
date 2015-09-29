var Backbone = require('backbone');
exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',
	url: '/messages/account/me',
	defaults: {
	},
});