var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',

	defaults: {
		createby: {}
	},

	initialize: function(options){
		this.url = config.api.host + '/project/statuses';
	},
});