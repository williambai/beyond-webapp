var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

var ListView = require('../views/_TradingList');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#list',

	loadingTemplate: _.template(loadingTpl),
	template: _.template('<h4>本轮交易记录</h4><p>自xxx起的交易记录。</p><hr><div id="list"></div>'),

	initialize: function(options) {
		this.symbol = options.symbol;
		this.from = options.from;
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
		this.listView.trigger('refresh',config.api.host + '/trading?type=strategy&symbol=' + this.symbol + '&from=' + this.from);
	},

	scroll: function(){
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