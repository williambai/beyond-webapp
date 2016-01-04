var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');
var OrderExchange = require('./OrderExchange');

exports = module.exports = Backbone.Collection.extend({
	model: OrderExchange,
	url: config.api.host + '/channel/order/exchanges',
});