var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');
var AccountActivity = require('./AccountActivity');

exports = module.exports = Backbone.Collection.extend({
	model: AccountActivity,
	url: config.api.host + '/channel/account/activities',
});