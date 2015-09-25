var Backbone = require('backbone');
var Notification = require('./Notification');

exports = module.exports = Backbone.Collection.extend({
	model: Notification
});