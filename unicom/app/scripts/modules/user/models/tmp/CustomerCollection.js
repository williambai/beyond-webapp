var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');
var Customer = require('./Customer');

exports = module.exports = Backbone.Collection.extend({
	model: Customer,
	url: config.api.host + '/channel/customers',
});