var _ = require('underscore');
var Backbone = require('backbone');
var ProductExchange = require('./ProductExchange');
var config = require('../conf');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/product/exchanges',
	model: ProductExchange,
});