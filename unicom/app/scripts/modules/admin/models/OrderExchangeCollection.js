var _ = require('underscore');
var Backbone = require('backbone');
var OrderExchange = require('./OrderExchange');
var config = require('../conf');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/admin/order/exchanges',
	model: OrderExchange,
});