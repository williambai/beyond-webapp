var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    deparmentTpl = require('../templates/_entityPlatformApp.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var PlatformApp = require('../models/PlatformApp');
var ListView = require('./_PlatformAppList');
var SearchView = require('./_PlatformAppSearch');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(deparmentTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .add': 'addPlatformApp',
		'click .edit': 'editPlatformApp',
		'click .delete': 'removePlatformApp',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();

		this.searchView = new SearchView({
			el: '#search',
		});
		this.searchView.done = function(query){
			that.listView.trigger('refresh', query);
		};
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
	addPlatformApp: function(){
		this.router.navigate('platform/app/add',{trigger: true});
		return false;
	},

	editPlatformApp: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('platform/app/edit/'+ id,{trigger: true});
		return false;
	},

	removePlatformApp: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).parent().attr('id');
			var model = new PlatformApp({_id: id});
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