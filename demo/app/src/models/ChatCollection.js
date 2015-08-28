var Backbone = require('backbone');
var Chat = require('./Chat');

exports = module.exports = Backbone.Collection.extend({
	model: Chat
});