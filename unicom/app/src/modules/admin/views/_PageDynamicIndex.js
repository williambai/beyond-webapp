var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    pageTpl = require('../templates/_entityPageDynamic.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var PageDynamic = require('../models/PageDynamic');
var ListView = require('./_PageDynamicList');
var SearchView = require('./_PageDynamicSearch');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(pageTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .add': 'addPageDynamic',
		'click .view': 'viewPageDynamic',
		'click .edit': 'editPageDynamic',
		'click .delete': 'removePageDynamic',
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
		this.searchView.done = function(query){
			that.listView.trigger('refresh', query);
		};
		this.searchView.trigger('load');
		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},
	
	addPageDynamic: function(){
		this.router.navigate('page/dynamic/add',{trigger: true});
		return false;
	},

	viewPageDynamic: function(evt){
		var id = this.$(evt.currentTarget).closest('.item').attr('id');
		this.router.navigate('page/dynamic/view/'+ id,{trigger: true});
		return false;
	},

	editPageDynamic: function(evt){
		var id = this.$(evt.currentTarget).closest('.item').attr('id');
		this.router.navigate('page/dynamic/edit/'+ id,{trigger: true});
		return false;
	},

	removePageDynamic: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).closest('.item').attr('id');
			var model = new PageDynamic({_id: id});
			model.destroy({wait: true});
			this.listView.trigger('refresh');
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