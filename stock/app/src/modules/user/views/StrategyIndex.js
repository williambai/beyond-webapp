var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	loadingTpl = require('../templates/__loading.tpl'),
	contentTpl = require('../templates/strategyIndex.tpl');
var config = require('../conf');

var SearchView = require('../views/_StrategySearch');
var ListView = require('../views/_StrategyList');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',
	loadingTemplate: _.template(loadingTpl),
	template: _.template(contentTpl),

	initialize: function(options) {
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
		this.searchView.done = function(query){
			that.listView.trigger('refresh', config.api.host + '/strategy?type=search&' + query);
		};

		this.listView = new ListView({
			el: '#list',
		});

		this.searchView.trigger('load');
		this.listView.trigger('load');
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