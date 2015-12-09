var _ = require('underscore');
var Backbone = require('backbone');
var ChannelCustomer = require('./ChannelCustomer');
var config = require('../conf');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/channel/customers',
	model: ChannelCustomer,
});