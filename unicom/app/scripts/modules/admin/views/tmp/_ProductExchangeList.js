var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    ListView = require('./__ListView'),
    productTpl = require('../templates/_entityProductExchange.tpl'),
    ProductExchangeCollection = require('../models/ProductExchangeCollection');

Backbone.$ = $;
	
exports = module.exports = ListView.extend({
	el: '#list',

	initialize: function(options){
		var page = $(productTpl);
		var itemTemplate = $('#itemTemplate', page).html();
		this.template = _.template(_.unescape(itemTemplate || ''));
		this.collection = new ProductExchangeCollection();
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		return this.template({model: model.toJSON()});
	},
});
