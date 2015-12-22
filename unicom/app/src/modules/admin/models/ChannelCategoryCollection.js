var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');
var Model = require('./ChannelCategory');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/channel/categories',
	model: Model,
});