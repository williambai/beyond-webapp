var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');
var Model = require('./WeChat');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/platform/wechats',
	model: Model,
});