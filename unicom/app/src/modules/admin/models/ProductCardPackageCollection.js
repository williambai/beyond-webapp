var _ = require('underscore');
var Backbone = require('backbone');
var ProductCardPackage = require('./ProductCardPackage');
var config = require('../conf');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/dict/card/packages',
	model: ProductCardPackage,
});