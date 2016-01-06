var _ = require('underscore');
var Backbone = require('backbone');
var Goods = require('./Goods');
var config = require('../conf');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/goods',
	model: Goods,
});