var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    orderTpl = require('../templates/_entityOrder.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');
var Utils = require('./__Util');
var ListView = require('./__ListView');
var SearchView = require('./__SearchView');
Backbone.$ = $;

//** Order模型
var Order = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/protect/orders',	
	defaults: {
		customer: {},
		goods: {},
		customerInfo: {},
		bonus: {
			cash: 0,
			points: 0,
		},
		createBy: {},
		department: {},
	},
	validation: {
	},
});

//** Order集合
var OrderCollection = Backbone.Collection.extend({
	url: config.api.host + '/protect/orders',
	model: Order,
});
//** List子视图
var OrderListView  = ListView.extend({
	el: '#list',

	initialize: function(options){
		var page = $(orderTpl);
		var itemTemplate = $('#itemTemplate', page).html();
		this.template = _.template(_.unescape(itemTemplate || ''));
		this.collection = new OrderCollection();
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		this._transformTime(model);
		return this.template({model: model.toJSON()});
	},

	_transformTime: function(model){
		var createtime = model.get('lastupdatetime');
		var deltatime = Utils.transformTime(createtime);
		model.set('deltatime', deltatime);
	},
});

//** Search子视图
var OrderSearchView = SearchView.extend({
	el: '#search',

	initialize: function(options){
		var page = $(orderTpl);
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
//** 主页面
exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(orderTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .edit': 'editOrder',
		'click .delete': 'removeOrder',
		'click .export': 'exportOrder',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();

		this.searchView = new OrderSearchView({
			el: '#search',
		});
		this.listView = new OrderListView({
			el: '#list',
		});
		this.searchView.trigger('load');
		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},
	
	addOrder: function(){
		this.router.navigate('order/add',{trigger: true});
		return false;
	},

	editOrder: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('order/edit/'+ id,{trigger: true});
		return false;
	},

	removeOrder: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).parent().attr('id');
			var model = new Order({_id: id});
			model.destroy({wait: true});
			this.listView.trigger('refresh');
		}
		return false;
	},

	exportOrder: function(evt){
		this.router.navigate('order/export',{trigger: true});
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