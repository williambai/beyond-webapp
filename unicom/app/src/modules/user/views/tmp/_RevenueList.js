var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    ListView = require('./__ListView'),
    revenueTpl = require('../templates/_entityRevenue.tpl'),
    RevenueCollection = require('../models/RevenueCollection');

var Utils = require('./__Util');

Backbone.$ = $;
	
exports = module.exports = ListView.extend({
	el: '#list',

	initialize: function(options){
		var page = $(revenueTpl);
		var itemTemplate = $('#itemTemplate', page).html();
		this.template = _.template(_.unescape(itemTemplate || ''));
		this.collection = new RevenueCollection();
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		model.set('deltatime',Utils.transformTime(model.get('lastupdatetime')));
		return this.template({model: model.toJSON()});
	},
});
