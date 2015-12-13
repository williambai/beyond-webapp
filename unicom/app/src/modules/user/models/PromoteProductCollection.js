var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');
var PromoteProduct = require('./PromoteProduct');

exports = module.exports = Backbone.Collection.extend({
	model: PromoteProduct,
	url: config.api.host + '/promote/products',
});