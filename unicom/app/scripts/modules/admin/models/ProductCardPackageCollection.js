var _ = require('underscore');
var Backbone = require('backbone');
var ProductCardPackage = require('./ProductCardPackage');
var config = require('../conf');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/product/card/packages',
	model: ProductCardPackage,
});