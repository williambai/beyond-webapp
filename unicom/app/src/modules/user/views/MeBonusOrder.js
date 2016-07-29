var _ = require('underscore');
var $ = require('jquery');
var	Backbone = require('backbone');
var ListView = require('./common/__ListView');
var config = require('../conf');
var Utils = require('./common/__Util');

Backbone.$ = $;

//** Bonus模型
var Bonus = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/private/finance/bonuses',	
	defaults: {
	},
});

//** Order模型
var Order = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/private/orders',	
	defaults: {
		customer: {},
		product: {},
		goods: {}
	},
});
//** Order集合
var OrderCollection = Backbone.Collection.extend({
	model: Order,
	url: config.api.host + '/private/orders',
});

//** 列表子视图	
var OrderListView = ListView.extend({
	el: '#list',
	template: _.template($('#tpl-me-bonus-order-item').html()),

	initialize: function(options){
		this.collection = new OrderCollection();
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		model.set('deltatime',Utils.transformTime(model.get('lastupdatetime')));
		var item = this.template({model: model.toJSON()});
		var $item = $(item);
		$item.find('img').attr('src', model.get('thumbnail'));
		return $item.html();
	},
});

//** 页面主视图
exports = module.exports = Backbone.View.extend({

	el: '#content',
	template: _.template($('#tpl-me-bonus-order-index').html()),

	initialize: function(options) {
		this.router = options.router;
		this.model = new Bonus({_id: options.id});
		this.model.on('change', this.modelChanged, this);
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .back': 'back',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.model.fetch({
			xhrFields: {
				withCredentials: true
			},
		});
	},

	modelChanged: function(){
		this.render();
		this.loadOrderList();
	},

	loadOrderList: function(){
		this.listView = new OrderListView({
			el: '#list',
		});
		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},
	
	back: function(){
		this.router.navigate('me/bonus',{trigger: true, replace: true});
		return false;
	},

	render: function() {
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});