var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');
var Model = require('./Role');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/platform/roles',
	model: Model,
});