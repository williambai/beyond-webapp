var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');
var config = require('../../conf');
var ListView = require('../../base/ListView');
Backbone.$ = $;

//** Category模型
var Category = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/public/product/categories',	
	defaults: {
	},
});
//** Category集合
var CategoryCollection = Backbone.Collection.extend({
	model: Category,
	url: config.api.host + '/public/product/categories',
});

//** 列表子视图
var CategoryListView = ListView.extend({

	el: '#list',
	template: _.template($('#tpl-category-item').html()),

	initialize: function(options){
		this.collection = new CategoryCollection();
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		var item = this.template({model: model.toJSON()});
		var $item = $(item);
		$item.find('img').attr('src', model.get('thumbnail'));
		return $item.html();
	},
});

//** 主视图
exports = module.exports = Backbone.View.extend({

	el: '#content',
	template: _.template($('#tpl-category-index').html()),

	initialize: function(options) {
		this.router = options.router;
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .item': 'categoryView',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();
		this.listView = new CategoryListView({
			el: '#list',
		});
		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},

	categoryView: function(evt){
		var id = this.$(evt.currentTarget).closest('.item').attr('id');
		this.router.navigate('/category/'+ id + '/products',{trigger: true});
		return false;
	},

	render: function() {
		this.$el.html(this.template());
		return this;
	},
});