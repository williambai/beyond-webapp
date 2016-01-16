var _ = require('underscore');
var Backbone = require('backbone');
var Channel = require('./Channel');
var config = require('../conf');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/channels',
	model: Channel,
});