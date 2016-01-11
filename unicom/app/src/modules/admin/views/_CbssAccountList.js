var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    ListView = require('./__ListView'),
    accountTpl = require('../templates/_entityCbssAccount.tpl'),
    CbssAccountCollection = require('../models/CbssAccountCollection');

Backbone.$ = $;
	
exports = module.exports = ListView.extend({
	el: '#list',

	initialize: function(options){
		var page = $(accountTpl);
		var itemTemplate = $('#itemTemplate', page).html();
		this.template = _.template(_.unescape(itemTemplate || ''));
		this.collection = new CbssAccountCollection();
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		return this.template({model: model.toJSON()});
	},
});
