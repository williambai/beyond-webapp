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
		var page = $(strategyTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .delete': 'removePortfolio',
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

	removePortfolio: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).closest('.item').attr('id');
			var model = new TradePortfolio({_id: id});
			model.destroy({wait: true});
			this.listView.trigger('refresh');
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