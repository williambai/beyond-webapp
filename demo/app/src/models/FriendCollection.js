var Backbone = require('backbone');
var Friend = require('./Friend');

exports = module.exports = Backbone.Collection.extend({
	model: Friend
});