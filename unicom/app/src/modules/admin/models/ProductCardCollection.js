var _ = require('underscore');
var Backbone = require('backbone');
var ProductCard = require('./ProductCard');
var config = require('../conf');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/product/cards',
	model: ProductCard,
});