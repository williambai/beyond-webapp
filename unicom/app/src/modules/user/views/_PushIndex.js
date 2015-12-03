var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    pushTpl = require('../templates/_entityPush.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');
var ListView = require('./_CardList');

Backbone.$ = $;

var RecommendView = require('./_PushRecommend');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		var page = $(pushTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));

		this.recommendView = new RecommendView({
			el: '#content',
		});

		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .search': 'search',
		'click .recommend': 'recommend',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();
		this.listView = new ListView({
			el: '#list',
		});
		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},

	// search: function(){
	// 	this.searchView.trigger('load');
	// },

	recommend: function(){
		this.recommendView.trigger('load');
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