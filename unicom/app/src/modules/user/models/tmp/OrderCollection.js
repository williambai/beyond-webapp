var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');
var Order = require('./Order');

exports = module.exports = Backbone.Collection.extend({
	model: Order,
	url: config.api.host + '/channel/orders',
});