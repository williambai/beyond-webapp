var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');
var TradingStrategy = require('./TradingStrategy');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/strategy',
	model: TradingStrategy,
});