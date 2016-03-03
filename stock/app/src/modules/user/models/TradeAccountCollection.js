var _ = require('underscore');
var Backbone = require('backbone');
var TradeAccount = require('./TradeAccount');
var config = require('../conf');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/stock/accounts',
	model: TradeAccount,
});