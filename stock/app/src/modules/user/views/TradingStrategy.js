var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	loadingTemplate = require('../templates/loading.tpl'),
	template = require('../templates/tradingStrategy.tpl');
var config = require('../conf');

var SearchView = require('../views/_Search2');
var ListView = require('../views/_ListTradingStrategy');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

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

		this.listView = new ListView();

		this.searchView = new SearchView();
		this.searchView.done = function(query){
			that.listView.trigger('refresh', config.api.host + '/strategy?type=search&' + query);
		};

		this.listView.trigger('load');
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