var _ = require('underscore');
var Backbone = require('backbone');
var config = require('../conf');

exports = module.exports = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: function(){
		return config.api.host + '/protect/wechat/'+ this.get('wid') + '/menus';
	},
});
