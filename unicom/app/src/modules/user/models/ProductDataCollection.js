var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');
var ProductData = require('./ProductData');

exports = module.exports = Backbone.Collection.extend({
	model: ProductData,
	url: config.api.host + '/page/data',
});