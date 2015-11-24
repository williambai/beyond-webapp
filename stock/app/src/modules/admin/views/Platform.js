var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone');

var loadingTemplate = require('../templates/loading.tpl'),
	template = require('../templates/platform.tpl');

var Platform = require('../models/Platform');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',
	loaded: false,

	initialize: function(options) {
		this.model = new Platform();
		this.on('load', this.load, this);
		this.model.on('change', this.render, this);
	},

	events: {
		'click #quote_start': 'quoteStart',
		'click #quote_stop': 'quoteStop',
		'click #trade_start': 'tradeStart',
		'click #trade_stop': 'tradeStop',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();
		this.model.fetch();
	},

	quoteStart: function() {
		$.ajax({
			url: config.api.host + '/platform/start',
			type: 'POST',
			data: {},
			xhrFields: {
				withCredentials: true
			},
		}).done(function() {
			window.location.reload();
		}).fail(function(err) {
			window.location.reload();
		});
		return false;
	},

	quoteStop: function() {
		$.ajax({
			url: config.api.host + '/platform/stop',
			type: 'POST',
			data: {},
			xhrFields: {
				withCredentials: true
			},
		}).done(function() {
			window.location.reload();
		}).fail(function(err) {
			window.location.reload();
		});
		return false;
	},

	tradeStart: function() {
		$.ajax({
			url: config.api.host + '/platform/trade/start',
			type: 'POST',
			data: {},
			xhrFields: {
				withCredentials: true
			},
		}).done(function() {
			window.location.reload();
		}).fail(function(err) {
			window.location.reload();
		});
		return false;
	},

	tradeStop: function() {
		$.ajax({
			url: config.api.host + '/platform/trade/stop',
			type: 'POST',
			data: {},
			xhrFields: {
				withCredentials: true
			},
		}).done(function() {
			window.location.reload();
		}).fail(function(err) {
			window.location.reload();
		});
		return false;
	},	

	render: function() {
		if (!this.loaded) {
			this.$el.html(loadingTemplate());
		} else {
			this.$el.html(template({model: this.model.toJSON()}));
		}
		return this;
	},
});