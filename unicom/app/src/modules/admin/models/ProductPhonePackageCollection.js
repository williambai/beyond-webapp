var _ = require('underscore');
var Backbone = require('backbone');
var ProductPhonePackage = require('./ProductPhonePackage');
var config = require('../conf');

exports = module.exports = Backbone.Collection.extend({
	url: function(){
		return config.api.host + '/product/phone/'+ this.pid + '/packages';
	},
	model: ProductPhonePackage,
});