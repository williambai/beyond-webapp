var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');
var Model = require('./Department');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + 'channel/departments',
	model: Model,
});