var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	loadingTemplate = _.template(require('../templates/loading.tpl')),
	template = _.template(require('../templates/strategyTradingRecord.tpl'));
var config = require('../conf');

var ListView = require('../views/_ListTradingRecord');

Backbone.$ = $;

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
		'scroll': 'scroll',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();

		this.listView = new ListView();
		this.listView.trigger('refresh',config.api.host + '/trading?type=search&searchStr=' + this.symbol + '&from=' + this.from);
	},

	scroll: function(){
		this.listView.scroll();
		return false;
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