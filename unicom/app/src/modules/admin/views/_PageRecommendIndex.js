var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    recommendTpl = require('../templates/_entityPageRecommend.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var PageRecommend = require('../models/PageRecommend');
var ListView = require('./_PageRecommendList');
var SearchView = require('./_PageRecommendSearch');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(recommendTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .add': 'addPageRecommend',
		'click .edit': 'editPageRecommend',
		'click .delete': 'removePageRecommend',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();

		this.searchView = new SearchView({
			el: '#search',
		});
		this.listView = new ListView({
			el: '#list',
		});
		this.searchView.trigger('load');
		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},
	
	addPageRecommend: function(){
		this.router.navigate('recommend/add',{trigger: true});
		return false;
	},

	editPageRecommend: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('recommend/edit/'+ id,{trigger: true});
		return false;
	},

	removePageRecommend: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).parent().attr('id');
			var model = new PageRecommend({_id: id});
			model.destroy({wait: true});
			this.listView.trigger('refresh',model.urlRoot);
		}
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