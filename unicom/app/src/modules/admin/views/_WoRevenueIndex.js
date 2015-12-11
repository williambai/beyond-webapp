var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    cardTpl = require('../templates/_entityWoRevenue.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var WoRevenue = require('../models/WoRevenue');
var ListView = require('./_WoRevenueList');
var SearchView = require('./_WoRevenueSearch');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(cardTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .add': 'addWoRevenue',
		'click .edit': 'editWoRevenue',
		'click .delete': 'removeWoRevenue',
		'click .import': 'importWoRevenue',
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
	
	addWoRevenue: function(){
		this.router.navigate('card/add',{trigger: true});
		return false;
	},

	editWoRevenue: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('card/edit/'+ id,{trigger: true});
		return false;
	},

	removeWoRevenue: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).parent().attr('id');
			var model = new WoRevenue({_id: id});
			model.destroy({wait: true});
			this.listView.trigger('refresh',model.urlRoot);
		}
		return false;
	},

	importWoRevenue: function(){
		this.router.navigate('card/import',{trigger: true});
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