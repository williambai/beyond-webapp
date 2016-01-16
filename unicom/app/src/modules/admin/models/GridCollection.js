var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');
var Model = require('./Grid');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/grids',
	model: Model,
});