var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    dataTpl = require('../templates/_entityPromoteMedia.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var PromoteMedia = require('../models/PromoteMedia');
var ListView = require('./_PromoteMediaList');
var SearchView = require('./_PromoteMediaSearch');

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
		'click .add': 'addPromoteMedia',
		'click .edit': 'editPromoteMedia',
		'click .delete': 'removePromoteMedia',
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
	
	addPromoteMedia: function(){
		this.router.navigate('promote/media/add',{trigger: true});
		return false;
	},

	editPromoteMedia: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('promote/media/edit/'+ id,{trigger: true});
		return false;
	},

	removePromoteMedia: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).parent().attr('id');
			var model = new PromoteMedia({_id: id});
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