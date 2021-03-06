var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    channelCategoryTpl = require('../templates/_entityChannelCategory.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var Category = require('../models/ChannelCategory');
var ListView = require('./_ChannelCategoryList');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(channelCategoryTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));

		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .add': 'addCategory',
		'click .edit': 'editCategory',
		'click .delete': 'removeCategory',
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

	addCategory: function(){
		this.router.navigate('channel/category/add',{trigger: true});
		return false;
	},

	editCategory: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('channel/category/edit/'+ id,{trigger: true});
		return false;
	},

	removeCategory: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).parent().attr('id');
			var model = new Category({_id: id});
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