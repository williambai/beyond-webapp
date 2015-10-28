var Backbone = require('backbone');
var _ = require('underscore');
var Account = require('./Account');

exports = module.exports = Backbone.Collection.extend({
	model: Account,
	ignoreIds: [],

	initialize: function(options){
		options = options || {};
		this.ignoreIds = options.ignoreIds;
	},

	parse: function(response,options){
		var that = this;
		var filtered = _.filter(response, function(model){
			var has = _.contains(that.ignoreIds,model['_id']);
			if(!has) return model;
		});
		return filtered;
	},
});