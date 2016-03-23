var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    productTpl = require('../templates/_entityProduct.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;
var ListView = require('./__ListView');

//** Product模型
var Product = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/channel/product/directs',	
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
	url: config.api.host + '/channel/product/directs',
});

//** 列表子视图
var ProductListView = ListView.extend({
	el: '#list',

	initialize: function(options){
		var page = $(productTpl);
		var itemTemplate = $('#itemTemplate', page).html();
		this.template = _.template(_.unescape(itemTemplate || ''));
		this.collection = new ProductCollection();
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		return this.template({model: model.toJSON()});
	},
});


exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(productTpl);
		var indexTemplate = $('#hotTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));

		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .search': 'search',
		'click .view': 'productView',
		'click .wechat': 'wechat',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();
		this.listView = new ProductListView({
			el: '#list',
		});
		this.listView.collection.url = config.api.host + '/channel/product/directs';
		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},

	search: function(){
		this.$('#search').show();
		return false;
	},

	productView: function(evt){
		var id = this.$(evt.currentTarget).closest('.item').attr('id');
		this.router.navigate('product/view/'+ id,{trigger: true});
		return false;
	},

	wechat: function(evt){
		var id = this.$(evt.currentTarget).closest('.item').attr('id');
		window.location.href = config.api.host + '/sale/page/data/' + config.wechat.appid + '/' + id + '/' + this.router.account.id;
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