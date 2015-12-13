var _ = require('underscore');
var Backbone = require('backbone');
var PromoteMedia = require('./PromoteMedia');
var config = require('../conf');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/promote/medias',
	model: PromoteMedia,
});