var _ = require('underscore');
var Backbone = require('backbone');
var PageRecommend = require('./PageRecommend');
var config = require('../conf');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/page/recommends',
	model: PageRecommend,
});