var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');
var TradeTransaction = require('./TradeTransaction');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/trade/transactions',
	model: TradeTransaction,
});