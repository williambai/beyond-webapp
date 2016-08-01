var _ = require('underscore');
var $ = require('jquery');
var	Backbone = require('backbone');
var config = require('../../conf');

Backbone.$ = $;
var ListView = require('../../_base/__ListView');

//** Product模型
var Product = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/public/products',	
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
	url: config.api.host + '/public/products',
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
		this.listView.collection.url = config.api.host + '/public/products';
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

	productOrder: function(evt){
		var id = this.$(evt.currentTarget).closest('.item').attr('id');
		this.router.navigate('product/order/'+ id,{trigger: true});
		return false;
	},

	productREcommend: function(evt){
		var id = this.$(evt.currentTarget).closest('.item').attr('id');
		this.router.navigate('product/recommend/'+ id,{trigger: true});
		return false;
	},

	wechat: function(evt){
		var id = this.$(evt.currentTarget).closest('.item').attr('id');
		window.location.href = config.api.host + '/sns/weixin/share/' + config.wechat.appid + '/' + id + '/' + this.router.account.id;
		return false;
	},
	
	sms: function(evt){
		var id = this.$(evt.currentTarget).closest('.item').attr('id');
		var productName = this.$(evt.currentTarget).closest('.item').attr('data');
		$.ajax({
			url: config.api.host + '/s', //** 短连接地址
			type: 'POST',
			xhrFields: {
				withCredentials: true
			},
			data: {
				original: config.api.host + '/sns/web/sale/' + id + '/' + this.router.account.id,
			},
			crossDomain: true,
		}).done(function(data) {
			var shortCode = data.shortCode;
			var smsBody = '贵州联通沃产品有礼了：' + productName + '产品抢先订。' + config.api.host + '/s/' + shortCode;
			if(/iPhone/.test(navigator.userAgent)){
				window.location.href="sms:sms:&body=" + smsBody;
			}else{
				window.location.href="sms:?body=" + smsBody;
			}
		});
		return false;
	},

	render: function() {
		this.$el.html(this.template());
		return this;
	},
});