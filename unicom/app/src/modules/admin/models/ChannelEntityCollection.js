var _ = require('underscore');
var Backbone = require('backbone');
var ChannelEntity = require('./ChannelEntity');
var config = require('../conf');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/channel/entities',
	model: ChannelEntity,
});