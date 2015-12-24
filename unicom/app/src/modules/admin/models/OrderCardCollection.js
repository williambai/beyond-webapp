var _ = require('underscore');
var Backbone = require('backbone');
var OrderCard = require('./OrderCard');
var config = require('../conf');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/admin/order/cards',
	model: OrderCard,
});