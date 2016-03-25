var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    meTpl = require('../templates/_entityMe.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var ListView = require('./__ListView');
var config = require('../conf');
var Utils = require('./__Util');

Backbone.$ = $;

//** Bonus模型
var Bonus = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/protect/finance/bonuses',	
	defaults: {
	},
});

//** Order模型
var Order = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/public/orders',	
	defaults: {
		customer: {},
		product: {},
		goods: {}
	},
});
//** Order集合
var OrderCollection = Backbone.Collection.extend({
	model: Order,
	url: config.api.host + '/public/orders',
});

//** 列表子视图	
var OrderListView = ListView.extend({
	el: '#list',

	initialize: function(options){
		var page = $(meTpl);
		var itemTemplate = $('#bonusOrderItemTemplate', page).html();
		this.template = _.template(_.unescape(itemTemplate || ''));
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

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(meTpl);
		this.model = new Bonus({_id: options.id});
		this.model.on('change', this.modelChanged, this);
		var indexTemplate = $('#bonusOrderListTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
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
		if (!this.loaded) {
			this.$el.html(this.loadingTemplate());
		} else {
			this.$el.html(this.template({model: this.model.toJSON()}));
		}
		return this;
	},
});