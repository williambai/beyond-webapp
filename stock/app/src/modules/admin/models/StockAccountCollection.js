var _ = require('underscore');
var Backbone = require('backbone');
var StockAccount = require('./StockAccount');
var config = require('../conf');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/trade/accounts',
	model: StockAccount,
});