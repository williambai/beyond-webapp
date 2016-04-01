var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    tradingTpl = require('../templates/_entityTradeTransaction.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

var SearchView = require('../views/_TradeTransactionSearch');
var ListView = require('../views/_TradeTransactionList');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		var page = $(tradingTpl);
		var indexTemplate = $('#indexTemplate', page).html();
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

		this.searchView = new SearchView({
			el: '#search',
		});
		this.searchView.done = function(query) {
			that.listView.trigger('refresh', query);
		};

		this.listView = new ListView({
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