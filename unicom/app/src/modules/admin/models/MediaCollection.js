var _ = require('underscore');
var Backbone = require('backbone');
var Media = require('./Media');
var config = require('../conf');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/medias',
	model: Media,
});