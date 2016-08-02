var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    productTpl = require('../templates/_entityProductDirect.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');
var ListView = require('./__ListView');
var SearchView = require('./__SearchView');
Backbone.$ = $;

//** 模型
var ProductDirect = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/protect/product/directs',	
	defaults: {
		goods: {},
		bonus: {
			income: 0,
			times: 1,
			points: 0,
		},
	},
	validation: {
	    'name': {
	    	minLength: 2,
	    	msg:'长度至少两位'
	    },
	    'goods[id]': {
			required: true,
			msg: '请选择一个物料'
	    }
	},
});
//** 集合
var ProductDirectCollection = Backbone.Collection.extend({
	url: config.api.host + '/protect/product/directs',
	model: ProductDirect,
});

//** List子视图	
var ProductListView = ListView.extend({
	el: '#list',

	initialize: function(options){
		var page = $(productTpl);
		var itemTemplate = $('#itemTemplate', page).html();
		this.template = _.template(_.unescape(itemTemplate || ''));
		this.collection = new ProductDirectCollection();
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		var item = this.template({model: model.toJSON()});
		var $item = $(item);
		$item.find('img').attr('src', model.get('thumbnail_url'));
		return $item.html();
	},
});

//** search子视图
var ProductSearchView =  SearchView.extend({
	el: '#search',

	initialize: function(options){
		var page = $(productTpl);
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
		var page = $(productTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .add': 'addProductDirect',
		'click .edit': 'editProductDirect',
		'click .delete': 'removeProductDirect',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();

		this.searchView = new ProductSearchView({
			el: '#search',
		});
		this.searchView.done = function(query){
			that.listView.trigger('refresh', query);
		};
		this.listView = new ProductListView({
			el: '#list',
		});
		this.searchView.trigger('load');
		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},
	
	addProductDirect: function(){
		this.router.navigate('product/direct/add',{trigger: true});
		return false;
	},

	editProductDirect: function(evt){
		var id = this.$(evt.currentTarget).closest('.item').attr('id');
		this.router.navigate('product/direct/edit/'+ id,{trigger: true});
		return false;
	},

	removeProductDirect: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).closest('.item').attr('id');
			var model = new ProductDirect({_id: id});
			model.destroy({wait: true});
			this.listView.trigger('refresh');
		}
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