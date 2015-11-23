var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    ItemView = require('./_ItemTradingStrategy'),
    ListView = require('./__ListView'),
    StrategyCollection = require('../models/TradingStrategyCollection');

Backbone.$ = $;
	
exports = module.exports = ListView.extend({
	el: '#list',

	initialize: function(options){
		this.collection = new StrategyCollection();
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		return new ItemView({model: model});
	},
});

