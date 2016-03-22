var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    ListView = require('./__ListView'),
    smsTpl = require('../templates/_entitySms.tpl'),
    ProductDirectCollection = require('../models/ProductDirectCollection');

Backbone.$ = $;
	
exports = module.exports = ListView.extend({
	el: '#list',

	initialize: function(options){
		var page = $(smsTpl);
		var itemTemplate = $('#itemTemplate', page).html();
		this.template = _.template(_.unescape(itemTemplate || ''));
		this.collection = new ProductDirectCollection();
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		var item = this.template({model: model.toJSON()});
		var $item = $(item);
		$item.find('img').attr('src', model.get('thumbnail'));
		return $item.html();
	},
});
