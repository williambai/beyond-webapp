var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');
var TradePortfolioHistroy = require('./TradePortfolioHistroy');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/trade/portfolios',
	model: TradePortfolioHistroy,
});