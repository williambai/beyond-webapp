var _ = require('underscore');
var Backbone = require('backbone');
var CbssAccount = require('./CbssAccount');
var config = require('../conf');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/cbss/accounts',
	model: CbssAccount,
});