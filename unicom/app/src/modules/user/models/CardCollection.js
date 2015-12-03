var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');
var Card = require('./Card');

exports = module.exports = Backbone.Collection.extend({
	model: Card,
	url: config.api.host + '/card',
});