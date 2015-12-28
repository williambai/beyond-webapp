var _ = require('underscore');
var Backbone = require('backbone');
var Customer = require('./Customer');
var config = require('../conf');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/customers',
	model: Customer,
});