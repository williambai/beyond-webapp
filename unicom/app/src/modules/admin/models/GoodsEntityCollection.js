var _ = require('underscore');
var Backbone = require('backbone');
var GoodsEntity = require('./GoodsEntity');
var config = require('../conf');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/goods/entities',
	model: GoodsEntity,
});