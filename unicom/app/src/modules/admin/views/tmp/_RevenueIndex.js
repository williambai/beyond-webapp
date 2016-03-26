var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    revenueTpl = require('../templates/_entityRevenue.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var Revenue = require('../models/Revenue');
var ListView = require('./_RevenueList');
var SearchView = require('./_RevenueSearch');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(revenueTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .add': 'addRevenue',
		'click .edit': 'editRevenue',
		'click .delete': 'removeRevenue',
		'click .import': 'importRevenue',
		'click .export': 'exportRevenue',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();

		this.searchView = new SearchView({
			el: '#search',
		});
		this.searchView.done = function(query){
			that.listView.trigger('refresh',query);
		}
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
	
	addRevenue: function(){
		this.router.navigate('revenue/add',{trigger: true});
		return false;
	},

	editRevenue: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('revenue/edit/'+ id,{trigger: true});
		return false;
	},

	removeRevenue: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).parent().attr('id');
			var model = new Revenue({_id: id});
			model.destroy({wait: true});
			this.listView.trigger('refresh');
		}
		return false;
	},

	importRevenue: function(){
		this.router.navigate('revenue/import',{trigger: true});
		return false;
	},

	exportRevenue: function(){
		this.router.navigate('revenue/export',{trigger: true});
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