var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    ListView = require('./__ListView'),
    helpTpl = require('../templates/_entityHelp.tpl'),

Backbone.$ = $;
	
exports = module.exports = ListView.extend({
	el: '#list',

	initialize: function(options){
		var page = $(helpTpl);
		var itemTemplate = $('#itemTemplate', page).html();
		this.template = _.template(_.unescape(itemTemplate || ''));
		this.collection = new Backbone.Collection.extend();
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		var item = this.template({model: model.toJSON()});
		var $item = $(item);
		$item.find('img').attr('src', model.get('thumbnail'));
		return $item.html();
	},
});
