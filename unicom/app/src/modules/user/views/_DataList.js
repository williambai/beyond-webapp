var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    ListView = require('./__ListView'),
    cardTpl = require('../templates/_entityData.tpl'),
    ProductDataCollection = require('../models/ProductDataCollection');

Backbone.$ = $;
	
exports = module.exports = ListView.extend({
	el: '#list',

	initialize: function(options){
		var page = $(cardTpl);
		var itemTemplate = $('#itemTemplate', page).html();
		this.template = _.template(_.unescape(itemTemplate || ''));
		this.collection = new ProductDataCollection();
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		return this.template({model: model.toJSON()});
	},
});
