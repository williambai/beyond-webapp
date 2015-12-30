var _ = require('underscore');
var Backbone = require('backbone');
var ProductPhonePackage = require('./ProductPhonePackage');
var config = require('../conf');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/dict/phone/packages',
	model: ProductPhonePackage,
});