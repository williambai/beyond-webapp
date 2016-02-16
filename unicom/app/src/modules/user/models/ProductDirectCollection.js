var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');
var ProductDirect = require('./ProductDirect');

exports = module.exports = Backbone.Collection.extend({
	model: ProductDirect,
	url: config.api.host + '/channel/product/goods',
});