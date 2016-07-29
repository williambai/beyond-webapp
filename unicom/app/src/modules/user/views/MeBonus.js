var _ = require('underscore');
var $ = require('jquery');
var	Backbone = require('backbone');
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
	template: _.template($('#tpl-me-bonus-item').html()),

	initialize: function(options){
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
	template: _.template($('#tpl-me-bonus-index').html()),

	initialize: function(options) {
		this.router = options.router;
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
		this.$el.html(this.template());
		return this;
	},
});