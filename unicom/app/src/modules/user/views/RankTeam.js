var _ = require('underscore');
var $ = require('jquery');
var	Backbone = require('backbone');
var ListView = require('./__ListView');
var SearchView = require('./__SearchView');
var config = require('../conf');
var Utils = require('./__Util');

Backbone.$ = $;

//** Order模型
var Order = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/public/orders',	
	defaults: {
	},
});
//** Order集合
var OrderCollection = Backbone.Collection.extend({
	model: Order,
	url: config.api.host + '/public/orders',
});

//** search视图
var OrderSearchView = SearchView.extend({
	el: '#search',
	template: _.template($('#tpl-rank-team-search').html()),

	initialize: function(options){
		this.on('load', this.load,this);
	},

	events: {
		'click .rankDay': 'rankDay',
		'click .rankPlace': 'rankPlace',
	},

	load: function(){
		this.render();
	},

	rankDay: function(evt){
		this.$('.rankDay').removeClass('active');
		this.$(evt.currentTarget).addClass('active');
		this.refreshList();
		return false;
	},
	rankPlace: function(evt){
		this.$('.rankPlace').removeClass('active');
		this.$(evt.currentTarget).addClass('active');
		this.refreshList();
		return false;
	},

	refreshList: function(){
		var rankDay = this.$('.rankDay.active').attr('data');
		var rankPlace = this.$('.rankPlace.active').attr('data');
		this.done('action=rankg'+'&days=' + rankDay + '&place=' + rankPlace);
		return false;
	},

	render: function(){
		this.$el.html(this.template());
	},
});

//** 列表子视图	
var OrderListView = ListView.extend({
	el: '#list',
	template: _.template($('#tpl-rank-team-item').html()),

	series: 0,
	initialize: function(options){
		this.collection = new OrderCollection();
		ListView.prototype.initialize.apply(this,options);
		this.on('reset:series', this.resetSeries, this);
	},
	getNewItemView: function(model){
		this.series++;
		model.set('series', this.series);
		return this.template({model: model.toJSON()});
	},
	resetSeries: function(){
		this.series = 0;
	},
});

//** 页面主视图
exports = module.exports = Backbone.View.extend({

	el: '#content',
	template: _.template($('#tpl-rank-team-index').html()),

	initialize: function(options) {
		this.router = options.router;
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
	},

	load: function() {
		var that = this;
		this.render();

		this.searchView = new OrderSearchView({
			el: '#search',
		});
		this.searchView.done = function(query){
			that.listView.trigger('reset:series', 0);			
			that.listView.trigger('refresh', query);
		};

		this.listView = new OrderListView({
			el: '#list',
		});
		//** 初始化url
		this.listView.collection.url = config.api.host + '/public/orders?action=rankg&days=1&place=grid';
		this.searchView.trigger('load');
		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},
	
	render: function() {
		this.$el.html(this.template());
		return this;
	},
});