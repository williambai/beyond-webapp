var _ = require('underscore');
var Backbone = require('backbone');
var PromoteProduct = require('./PromoteProduct');
var config = require('../conf');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/promote/products',
	model: PromoteProduct,
});