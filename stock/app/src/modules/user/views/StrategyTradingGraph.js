var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	loadingTemplate = _.template(require('../templates/loading.tpl')),
	template = _.template(require('../templates/strategyTradingGraph.tpl'));
var config = require('../conf');

Backbone.$ = $;
var GraphView = require('../views/_GraphTradingRecord');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	initialize: function(options) {
		this.symbol = options.symbol;
		var date = new Date();
		date.setTime(options.from);
		this.from = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
		this.on('load', this.load, this);
	},

	events: {
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();

		this.graphView = new GraphView({symbol: this.symbol});
		this.graphView.trigger('refresh', 'from=' + this.from);
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