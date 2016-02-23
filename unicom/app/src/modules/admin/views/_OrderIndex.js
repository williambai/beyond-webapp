var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    orderTpl = require('../templates/_entityOrder.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var Order = require('../models/Order');
var ListView = require('./_OrderList');
var SearchView = require('./_OrderSearch');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(orderTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .view': 'viewOrder',
		'click .delete': 'removeOrder',
		'click .export': 'exportOrder',
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
	
	addOrder: function(){
		this.router.navigate('order/add',{trigger: true});
		return false;
	},

	viewOrder: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('order/view/'+ id,{trigger: true});
		return false;
	},

	removeOrder: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).parent().attr('id');
			var model = new Order({_id: id});
			model.destroy({wait: true});
			this.listView.trigger('refresh');
		}
		return false;
	},

	exportOrder: function(evt){
		this.router.navigate('order/export',{trigger: true});
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