var _ = require('underscore');
var Backbone = require('backbone');
var ProductDirect = require('./ProductDirect');
var config = require('../conf');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/product/directs',
	model: ProductDirect,
});