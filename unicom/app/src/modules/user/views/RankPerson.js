var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    rankTpl = require('../templates/_entityRank.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var ListView = require('./__ListView');
var SearchView = require('./__SearchView');
var config = require('../conf');
var Utils = require('./__Util');

Backbone.$ = $;

//** Order模型
var Order = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/channel/product/directs',	
	defaults: {
	},
});
//** Order集合
var OrderCollection = Backbone.Collection.extend({
	model: Order,
	url: config.api.host + '/channel/product/directs',
});

//** search视图
var OrderSearchView = SearchView.extend({
	el: '#search',

	initialize: function(options){
		var page = $(rankTpl);
		var searchTemplate = $('#searchTemplate', page).html();
		this.template = _.template(_.unescape(searchTemplate || ''));
		this.on('load', this.load,this);
	},

	events: {
		'submit form': 'search',
		'click .rankDay': 'rankDay',
		'click .rankPlace': 'rankPlace',
	},

	load: function(){
		this.render();
	},

	search: function(){
		var query = this.$('form').serialize();
		this.done(query);
		return false;
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
		var rankDay = this.$('.rankDay.active').text();
		var rankPlace = this.$('.rankPlace.active').text();
		//TODO this.done('rankDay=' + rankDay + '&rankPlace=' + rankPlace);
		return false;
	},

	render: function(){
		this.$el.html(this.template());
	},
});

//** 列表子视图	
var OrderListView = ListView.extend({
	el: '#list',

	initialize: function(options){
		var page = $(rankTpl);
		var itemTemplate = $('#itemTemplate', page).html();
		this.template = _.template(_.unescape(itemTemplate || ''));
		this.collection = new OrderCollection();
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		return this.template({model: model.toJSON()});
	},
});

//** 页面主视图
exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(rankTpl);
		var indexTemplate = $('#personIndexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();

		this.searchView = new OrderSearchView({
			el: '#search',
		});
		this.searchView.done = function(query){
			that.listView.trigger('refresh', query);
		};

		this.listView = new OrderListView({
			el: '#list',
		});
		this.searchView.trigger('load');
		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
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