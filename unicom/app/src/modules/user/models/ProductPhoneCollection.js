var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');
var ProductPhone = require('./ProductPhone');

exports = module.exports = Backbone.Collection.extend({
	model: ProductPhone,
	url: config.api.host + '/product/phones',
});