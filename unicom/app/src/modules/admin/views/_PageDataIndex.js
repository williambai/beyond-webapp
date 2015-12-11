var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    dataTpl = require('../templates/_entityPageData.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var PageData = require('../models/PageData');
var ListView = require('./_PageDataList');
var SearchView = require('./_PageDataSearch');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(dataTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .add': 'addPageData',
		'click .edit': 'editPageData',
		'click .delete': 'removePageData',
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
	
	addPageData: function(){
		this.router.navigate('page/data/add',{trigger: true});
		return false;
	},

	editPageData: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('page/data/edit/'+ id,{trigger: true});
		return false;
	},

	removePageData: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).parent().attr('id');
			var model = new PageData({_id: id});
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