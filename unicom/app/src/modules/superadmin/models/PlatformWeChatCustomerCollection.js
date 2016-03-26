var _ = require('underscore');
var Backbone = require('backbone');
var PlatformWeChatCustomer = require('./PlatformWeChatCustomer');
var config = require('../conf');

exports = module.exports = Backbone.Collection.extend({
	url: config.api.host + '/protect/wechat/customers',
	model: PlatformWeChatCustomer,
});