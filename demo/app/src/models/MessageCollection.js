var Backbone = require('backbone');
var Message = require('./Message');

exports = module.exports = Backbone.Collection.extend({
	model: Message
});