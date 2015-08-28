var Backbone = require('backbone');
var Contact = require('./Contact');

exports = module.exports = Backbone.Collection.extend({
	model: Contact
});