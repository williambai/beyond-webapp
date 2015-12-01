var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    strategyTpl = require('../templates/_entityStrategy.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

var ListView = require('../views/_TradingList');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#list',

	loadingTemplate: _.template(loadingTpl),
	template: _.template('<div><a class="btn btn-primary" onclick="window.history.back();return false;">返回</a></div><hr/><p>自&nbsp;<strong><%= from %></strong>&nbsp;起的交易记录。</p><hr/><div id="list"></div>'),

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
		var page = $(strategyTpl);
		var itemTemplate = $('#itemTradingTemplate', page).html();
		this.listView.template = _.template(_.unescape(itemTemplate || ''));
		
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
			var date = new Date();
			date.setTime(this.from);
			this.$el.html(this.template({
				from: date.toLocaleString()
			}));
		}
		return this;
	},
});