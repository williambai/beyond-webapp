var _ = require('underscore');
var Backbone = require('backbone');
var PlatformFile = require('./PlatformFile');
var config = require('../conf');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/protect/files',
	model: PlatformFile,
});