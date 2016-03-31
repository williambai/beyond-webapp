var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    orderTpl = require('../templates/_entityOrder.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');
var ListView = require('./__ListView');
var Utils = require('./__Util');

Backbone.$ = $;
//** 模型
var Order = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/private/orders',	
	defaults: {
		customer: {},
		product: {},
		goods: {}
	},
});
//** 集合
var OrderCollection = Backbone.Collection.extend({
	model: Order,
	url: config.api.host + '/private/orders',
});
//** List子视图
var OrderListView = ListView.extend({
	el: '#list',

	initialize: function(options){
		var page = $(orderTpl);
		var itemTemplate = $('#itemTemplate', page).html();
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
		'click .view': 'orderView',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();

		this.listView = new OrderListView({
			el: '#list',
		});
		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},

	orderView: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('order/view/'+ id,{trigger: true});
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