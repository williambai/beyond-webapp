var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    goodsTpl = require('../templates/_entityGoods.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');
var ListView = require('./__ListView');
var SearchView = require('./__SearchView');

Backbone.$ = $;

//** 模型
var Goods = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/protect/goods',	
	defaults: {
	},
	validation: {
	    'name': {
	    	minLength: 2,
	    	msg:'长度至少两位'
	    },
	    'barcode': {
			required: true,
			msg: '请输入运营商系统的物料号'
	    }
	},
});
//** 集合
var GoodsCollection = Backbone.Collection.extend({
	url: config.api.host + '/protect/goods',
	model: Goods,
});

//** list子视图
var GoodsListView = ListView.extend({
	el: '#list',

	initialize: function(options){
		var page = $(goodsTpl);
		var itemTemplate = $('#itemTemplate', page).html();
		this.template = _.template(_.unescape(itemTemplate || ''));
		this.collection = new GoodsCollection();
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		return this.template({model: model.toJSON()});
	},
});

//** search子视图
var GoodsSearchView = SearchView.extend({
	el: '#search',

	initialize: function(options){
		var page = $(goodsTpl);
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
		var page = $(goodsTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .add': 'addGoods',
		'click .edit': 'editGoods',
		'click .delete': 'removeGoods',
		'click .import': 'importGoods',
		'click .export': 'exportGoods',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();

		this.searchView = new GoodsSearchView({
			el: '#search',
		});
		this.listView = new GoodsListView({
			el: '#list',
		});
		this.searchView.done = function(query){
			that.listView.trigger('refresh', query);
		};
		this.searchView.trigger('load');
		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},
	
	addGoods: function(){
		this.router.navigate('goods/add',{trigger: true});
		return false;
	},

	editGoods: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('goods/edit/'+ id,{trigger: true});
		return false;
	},

	removeGoods: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).parent().attr('id');
			var model = new Goods({_id: id});
			model.destroy({wait: true});
			this.listView.trigger('refresh');
		}
		return false;
	},

	importGoods: function(){
		this.router.navigate('goods/import',{trigger: true});
		return false;
	},

	exportGoods: function(){
		this.router.navigate('goods/export',{trigger: true});
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