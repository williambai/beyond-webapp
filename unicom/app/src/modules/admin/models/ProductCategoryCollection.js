var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');
var Model = require('./ProductCategory');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/product/categories',
	model: Model,
});