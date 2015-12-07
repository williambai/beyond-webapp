var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');
var Model = require('./Feature');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/feature',
	model: Model,
});