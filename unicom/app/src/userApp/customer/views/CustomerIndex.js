var _ = require('underscore');
var $ = require('jquery');
var	Backbone = require('backbone');
var config = require('../../conf');
var ListView = require('../../_base/__ListView');

Backbone.$ = $;

//** Customer模型
var Customer = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/private/customers',	
	defaults: {
	},
});
//** Customer集合
var CustomerCollection = Backbone.Collection.extend({
	model: Customer,
	url: config.api.host + '/private/customers',
});

//** List子视图
var CustomerListView = ListView.extend({
	el: '#list',
	template: _.template($('#tpl-me-customer-item').html()),

	initialize: function(options){
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
	template: _.template($('#tpl-me-customer-index').html()),

	initialize: function(options) {
		this.router = options.router;
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
		this.$el.html(this.template());
		return this;
	},
});