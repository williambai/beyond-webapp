var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    channelTpl = require('../templates/_entityChannelEntity.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var ChannelEntity = require('../models/ChannelEntity');
var ListView = require('./_ChannelEntityList');
var SearchView = require('./_ChannelEntitySearch');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(channelTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .add': 'addChannelEntity',
		'click .edit': 'editChannelEntity',
		'click .delete': 'removeChannelEntity',
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
	
	addChannelEntity: function(){
		this.router.navigate('channel/add',{trigger: true});
		return false;
	},

	editChannelEntity: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('channel/edit/'+ id,{trigger: true});
		return false;
	},

	removeChannelEntity: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).parent().attr('id');
			var model = new ChannelEntity({_id: id});
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