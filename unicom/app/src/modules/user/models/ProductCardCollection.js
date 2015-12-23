var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');
var ProductCard = require('./ProductCard');

exports = module.exports = Backbone.Collection.extend({
	model: ProductCard,
	url: config.api.host + '/channel/product/cards',
});