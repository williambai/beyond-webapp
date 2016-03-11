var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');
var TradeStrategy = require('./TradeStrategy');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/trade/strategies',
	model: TradeStrategy,
});