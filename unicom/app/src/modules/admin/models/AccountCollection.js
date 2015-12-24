var _ = require('underscore');
var Backbone = require('backbone');
var Account = require('./Account');
var config = require('../conf');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/admin/accounts',
	model: Account,
});