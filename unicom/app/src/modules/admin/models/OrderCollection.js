var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');
var Model = require('./Order');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/admin/orders',
	model: Model,
});