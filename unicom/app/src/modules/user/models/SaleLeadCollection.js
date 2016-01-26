var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');
var SaleLead = require('./SaleLead');

exports = module.exports = Backbone.Collection.extend({
	model: SaleLead,
	url: config.api.host + '/channel/sale/leads',
});