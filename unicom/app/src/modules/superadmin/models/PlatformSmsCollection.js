var _ = require('underscore');
var Backbone = require('backbone');
var PlatformSms = require('./PlatformSms');
var config = require('../conf');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/protect/smses',
	model: PlatformSms,
});