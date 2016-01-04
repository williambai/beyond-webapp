var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');
var ProductExchange = require('./ProductExchange');

exports = module.exports = Backbone.Collection.extend({
	model: ProductExchange,
	url: config.api.host + '/channel/product/exchanges',
});