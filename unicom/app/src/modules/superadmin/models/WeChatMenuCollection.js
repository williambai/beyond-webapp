var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');
var Model = require('./WeChatMenu');

exports = module.exports = Backbone.Collection.extend({
	url: function(){
		return config.api.host + '/platform/wechat/'+ this.wid + '/menus';
	},	
	model: Model,
});