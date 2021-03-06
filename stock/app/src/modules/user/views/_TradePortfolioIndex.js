var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	loadingTpl = require('../templates/__loading.tpl'),
	strategyTpl = require('../templates/_entityTradePortfolio.tpl');
var config = require('../conf');

var TradePortfolio = require('../models/TradePortfolio');

// var SearchView = require('../views/_StrategySearch');
var ListView = require('../views/_TradePortfolioList');

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
		'click .view': 'viewPortfolio',
		'click .delete': 'removePortfolio',
		'click .startTrade': 'startTrade',
		'click .stopTrade': 'stopTrade',		
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();

		// this.searchView = new SearchView({
		// 	el: '#search',
		// });
		// this.searchView.done = function(query){
		// 	that.listView.trigger('refresh', config.api.host + '/strategy?type=search&' + query);
		// };

		this.listView = new ListView({
			el: '#list',
		});

		// this.searchView.trigger('load');
		this.listView.trigger('load');
	},

	scroll: function(){
		this.listView.scroll();
		return false;
	},

	viewPortfolio: function(evt){
		var id = this.$(evt.currentTarget).closest('.item').attr('id');
		this.router.navigate('trade/portfolio/view/'+ id,{trigger: true});
		return false;
	},

	removePortfolio: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).closest('.item').attr('id');
			var model = new TradePortfolio({_id: id});
			model.destroy({wait: true});
			this.listView.trigger('refresh');
		}
		return false;
	},

	startTrade: function(evt){
		var that = this;
		if(window.confirm('您确信要启动交易吗？')){
			var id = this.$(evt.currentTarget).closest('.item').attr('id');
			// var model = new TradePortfolio({_id: id});
			// model.set('status','实战');
			$.ajax({
				url: config.api.host + '/trade/portfolios/' + id,
				type: 'PUT',
				xhrFields: {
					withCredentials: true
				},
				data: {
					status: '实战',
				},
				crossDomain: true,
			}).done(function(){
				that.listView.trigger('refresh');
			});
		}
		return false;
	},


	stopTrade: function(evt){
		var that = this;
		if(window.confirm('您确信要停止交易吗？')){
			var id = this.$(evt.currentTarget).closest('.item').attr('id');
			// var model = new TradePortfolio({_id: id});
			// model.set('status','实战');
			$.ajax({
				url: config.api.host + '/trade/portfolios/' + id,
				type: 'PUT',
				xhrFields: {
					withCredentials: true
				},
				data: {
					status: '模拟',
				},
				crossDomain: true,
			}).done(function(){
				that.listView.trigger('refresh');
			});
		}
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