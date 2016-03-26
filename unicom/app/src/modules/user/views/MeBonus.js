var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    meTpl = require('../templates/_entityMe.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var ListView = require('./__ListView');
var config = require('../conf');
var Utils = require('./__Util');

Backbone.$ = $;

//** 模型
var Bonus = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/private/finance/bonuses',	
	defaults: {
	},
});

//** 集合
var BonusCollection = Backbone.Collection.extend({
	model: Bonus,
	url: config.api.host + '/private/finance/bonuses',
});

//** 列表子视图	
var BonusListView = ListView.extend({
	el: '#list',

	initialize: function(options){
		var page = $(meTpl);
		var itemTemplate = $('#bonusItemTemplate', page).html();
		this.template = _.template(_.unescape(itemTemplate || ''));
		this.collection = new BonusCollection();
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
		var page = $(meTpl);
		var indexTemplate = $('#bonusListTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));

		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .back': 'back',
		'click .item': 'itemView',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();

		this.listView = new BonusListView({
			el: '#list',
		});
		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},
	
	back: function(){
		this.router.navigate('me/index',{trigger: true, replace: true});
		return false;
	},

	itemView: function(evt){
		var id = this.$(evt.currentTarget).closest('.item').attr('id');
		this.router.navigate('me/bonus/'+ id, {trigger: true, replace: true});
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