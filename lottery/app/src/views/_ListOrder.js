var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    ItemOrderView = require('./_ItemOrder'),
    ListView = require('./__ListView'),
    OrderCollection = require('../models/OrderCollection');

Backbone.$ = $;
	
exports = module.exports = ListView.extend({
	el: '#list',

	initialize: function(options){
		this.account = options.account;
		this.collection = new OrderCollection();
		this.collection.url = options.url;
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		return new ItemOrderView({model: model,account: this.account});
	},
});

