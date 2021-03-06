var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    customerTpl = require('../templates/_entityCustomer.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');
var ListView = require('./__ListView');
var SearchView = require('./__SearchView');

Backbone.$ = $;

//** 模型
var Customer = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/protect/customers',	
	
	defaults: {
	},
	
	validation: {
		'name': {
			required: true,
			msg: '请输入客户姓名'
		},
		'mobile': {
			pattern: /^(1\d{10}|[a-zA-Z0-9_\.]+@[a-zA-Z0-9-]+[\.a-zA-Z]+)$/,
			msg: '请输入有效的手机号码'
		},
	},	
});

//** 集合
var CustomerCollection = Backbone.Collection.extend({
	url: config.api.host + '/protect/customers',
	model: Customer,
});

//** list子视图
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

//** search子视图
var CustomerSearchView = SearchView.extend({
	el: '#search',

	initialize: function(options){
		var page = $(customerTpl);
		var searchTemplate = $('#searchTemplate', page).html();
		this.template = _.template(_.unescape(searchTemplate || ''));
		this.model = new (Backbone.Model.extend({}));
		this.on('load', this.load,this);
	},

	events: {
		'submit form': 'search'
	},

	load: function(){
		this.render();
	},

	search: function(){
		var query = this.$('form').serialize();
		this.done(query);
		return false;
	},

	render: function(){
		this.$el.html(this.template({model: this.model.toJSON()}));
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
		'click .add': 'addCustomer',
		'click .edit': 'editCustomer',
		'click .delete': 'removeCustomer',
		'click .import': 'importCustomer',
		'click .export': 'exportCustomer',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();

		this.searchView = new CustomerSearchView({
			el: '#search',
		});
		this.searchView.done = function(query){
			that.listView.trigger('refresh',query);
		}
		this.listView = new CustomerListView({
			el: '#list',
		});
		this.searchView.trigger('load');
		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},
	
	addCustomer: function(){
		this.router.navigate('customer/add',{trigger: true});
		return false;
	},

	editCustomer: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('customer/edit/'+ id,{trigger: true});
		return false;
	},

	removeCustomer: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).parent().attr('id');
			var model = new Customer({_id: id});
			model.destroy({wait: true});
			this.listView.trigger('refresh');
		}
		return false;
	},

	importCustomer: function(){
		this.router.navigate('customer/import',{trigger: true});
		return false;
	},

	exportCustomer: function(){
		this.router.navigate('customer/export',{trigger: true});
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