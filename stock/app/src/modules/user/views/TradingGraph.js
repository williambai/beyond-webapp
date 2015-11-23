var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	loadingTemplate = require('../templates/loading.tpl'),
	template = require('../templates/tradingGraph.tpl');
var config = require('../conf');

Backbone.$ = $;

var SearchView = require('../views/_SearchTradingRecord');
var GraphView = require('../views/_GraphTradingRecord');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	initialize: function(options) {
		this.symbol = options.symbol;
		this.on('load', this.load, this);
	},

	events: {
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();

		this.graphView = new GraphView({symbol: this.symbol});

		this.searchView = new SearchView();

		this.searchView.done = function(query){
			that.graphView.trigger('refresh', query);
		};
		this.graphView.trigger('load');
	},

	render: function() {
		if (!this.loaded) {
			this.$el.html(loadingTemplate());
		} else {
			this.$el.html(template());
		}
		return this;
	},
});