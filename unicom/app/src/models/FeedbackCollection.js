var _ = require('underscore');
var Backbone = require('backbone');
var Feedback = require('./Feedback');
var config = require('../conf');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/platform/feedbacks',
	model: Feedback,
});