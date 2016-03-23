var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    customerTpl = require('../templates/_entityCustomer.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');
var ListView = require('./__ListView');

Backbone.$ = $;

//** Customer模型
var Customer = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/channel/customers',	
	defaults: {
	},
});
//** Customer集合
var CustomerCollection = Backbone.Collection.extend({
	model: Customer,
	url: config.api.host + '/channel/customers',
});

//** List子视图
var CustomerListView = ListView.extend({
	el: '#list',

	initialize: function(options){
		var page = $(customerTpl);
		var itemTemplate = $('#itemTemplate', page).html();
		this.template = _.template(_.unescape(itemTemplate || ''));
		this.collection = new CustomerCollection();
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		return this.template({model: model.toJSON()});
	},
});
//** 主视图
exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(customerTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .view': 'customerView',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();
		this.listView = new CustomerListView({
			el: '#list',
		});
		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},

	customerView: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('customer/view/'+ id,{trigger: true});
		return false;
	},
	
	render: function() {
		if (!this.loaded) {
			this.$el.html(this.loadingTemplate());
		} else {
			this.$el.html(this.template());
		}
		return this;
	},
});