var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');
var TradingRecord = require('./TradingRecord');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/trading',
	model: TradingRecord,
});