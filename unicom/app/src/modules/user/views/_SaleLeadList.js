var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    ListView = require('./__ListView'),
    roleTpl = require('../templates/_entitySaleLead.tpl'),
    SaleLeadCollection = require('../models/SaleLeadCollection');

Backbone.$ = $;
	
exports = module.exports = ListView.extend({
	el: '#list',

	initialize: function(options){
		var page = $(roleTpl);
		var itemTemplate = $('#itemTemplate', page).html();
		this.template = _.template(_.unescape(itemTemplate || ''));
		this.collection = new SaleLeadCollection();
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		return this.template({model: model.toJSON()});
	},
});
