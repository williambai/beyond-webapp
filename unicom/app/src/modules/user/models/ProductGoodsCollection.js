var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');
var ProductGoods = require('./ProductGoods');

exports = module.exports = Backbone.Collection.extend({
	model: ProductGoods,
	url: config.api.host + '/channel/product/goods',
});