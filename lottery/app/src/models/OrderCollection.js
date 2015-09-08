var Backbone = require('backbone');
var Order = require('./Order');

exports = module.exports = Backbone.Collection.extend({
	model: Order,

});