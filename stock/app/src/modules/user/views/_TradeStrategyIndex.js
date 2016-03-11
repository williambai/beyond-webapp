var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	loadingTpl = require('../templates/__loading.tpl'),
	strategyTpl = require('../templates/_entityTradeStrategy.tpl');
var config = require('../conf');

var TradeStrategy = require('../models/TradeStrategy');
var ListView = require('../views/_TradeStrategyList');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#index',
	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(strategyTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .add': 'addStrategy',
		'click .edit': 'editStrategy',
		'click .delete': 'removeStrategy',
		'click .view': 'viewStrategy',
		'click .invest': 'investAction',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();

		this.listView = new ListView({
			el: '#list',
		});

		this.listView.trigger('load');
	},

	scroll: function(){
		this.listView.scroll();
		return false;
	},

	addStrategy: function(){
		this.router.navigate('trade/strategy/add',{trigger: true});
		return false;
	},

	editStrategy: function(evt){
		var id = this.$(evt.currentTarget).closest('.item').attr('id');
		this.router.navigate('trade/strategy/edit/'+ id,{trigger: true});
		return false;
	},

	removeStrategy: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).closest('.item').attr('id');
			var model = new TradeStrategy({_id: id});
			model.destroy({wait: true});
			this.listView.trigger('refresh');
		}
		return false;
	},

	viewStrategy: function(evt){
		var id = this.$(evt.currentTarget).closest('.item').attr('id');
		this.router.navigate('trade/strategy/view/'+ id,{trigger: true});
		return false;
	},

	investAction: function(evt){
		var id = this.$(evt.currentTarget).closest('.item').attr('id');
		this.router.navigate('trade/strategy/invest/'+ id,{trigger: true});
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