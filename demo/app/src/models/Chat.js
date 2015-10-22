var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',
	url: config.api.host + '/chats',

	validate: function(attrs, options){
	},
});