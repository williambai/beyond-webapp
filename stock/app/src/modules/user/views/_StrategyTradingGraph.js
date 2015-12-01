var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

var strategyTpl = require('../templates/_entityStrategy.tpl');

Backbone.$ = $;
var GraphView = require('../views/_TradingGraph');

exports = module.exports = Backbone.View.extend({

	el: '#graph',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		var page = $(strategyTpl);
		var graphTemplate = $('#graphTemplate', page).html();
		this.template = _.template(_.unescape(graphTemplate || ''));
		this.symbol = options.symbol;
		this.from = options.from;
		this.on('load', this.load, this);
	},

	events: {
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();

		this.graphView = new GraphView({symbol: this.symbol});
		this.graphView.trigger('refresh', config.api.host + '/trading?type=strategy&symbol=' + this.symbol + '&from=' + this.from);
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