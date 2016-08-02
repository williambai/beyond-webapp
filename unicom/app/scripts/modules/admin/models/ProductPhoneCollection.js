var _ = require('underscore');
var Backbone = require('backbone');
var ProductPhone = require('./ProductPhone');
var config = require('../conf');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/product/phones',
	model: ProductPhone,
});