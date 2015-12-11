var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    woTpl = require('../templates/_entityWo.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var SearchView = require('./_WoSearch');
var ListView = require('./_WoList');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(woTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));

		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .search': 'search',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();
		this.$('#search').hide();
		this.searchView = new SearchView({
			el: '#search',
		});
		this.listView = new ListView({
			el: '#list',
		});
		this.searchView.trigger('load');
		this.searchView.done = function(search){
			console.log(search);
			that.$('#search').hide();
		};
		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},

	search: function(){
		this.$('#search').show();
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