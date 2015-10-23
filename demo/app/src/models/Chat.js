var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',

	initialize: function(options){
		this.url = config.api.host + '/chats/account/' + options.fid;
	},

	validate: function(attrs, options){
	},
});