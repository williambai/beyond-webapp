var _ = require('underscore');
var $ = require('jquery');
var	Backbone = require('backbone');
var config = require('../../conf');

Backbone.$ = $;
var ListView = require('../../base/ListView');

//** Product模型
var Product = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/public/products1',	
	defaults: {
		goods: {},
		bonus: {
			income: 0,
			times: 1,
		},
	},
});

//** Product集合
var ProductCollection = Backbone.Collection.extend({
	model: Product,
	url: config.api.host + '/public/products1',
});

//** 列表子视图
var ProductListView = ListView.extend({
	el: '#list',
	template: _.template($('#tpl-product-item').html()),

	initialize: function(options){
		this.collection = new ProductCollection();
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		var item = this.template({model: model.toJSON()});
		var $item = $(item);
		$item.find('img').attr('src', model.get('thumbnail_url'));
		return $item.html();
	},
});


exports = module.exports = Backbone.View.extend({

	el: '#content',
	template: _.template($('#tpl-product-hot').html()),

	initialize: function(options) {
		this.router = options.router;
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .search': 'search',
		'click .order': 'productOrder',
		'click .recommend': 'productREcommend',
		'click .wechat': 'wechat',
		'click .sms': 'sms',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();
		this.listView = new ProductListView({
			el: '#list',
		});
		this.listView.collection.url = config.api.host + '/public/products1?uid=' + this.router.account.email;
		this.listView.trigger('load');
	},

	scroll: function() {
		// this.listView.scroll();
		return false;
	},

	search: function(){
		this.$('#search').show();
		return false;
	},

	productOrder: function(evt){
		var id = this.$(evt.currentTarget).closest('.item').attr('id');
		this.router.navigate('product/order/'+ id,{trigger: true});
		return false;
	},

	render: function() {
		this.$el.html(this.template());
		return this;
	},
});