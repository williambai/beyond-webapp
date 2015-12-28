var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    customerTpl = require('../templates/_entityCustomer.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var Customer = require('../models/Customer');
var ListView = require('./_CustomerList');
var SearchView = require('./_CustomerSearch');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(customerTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .add': 'addCustomer',
		'click .edit': 'editCustomer',
		'click .delete': 'removeCustomer',
		'click .import': 'importCustomer',
		'click .export': 'exportCustomer',
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
	
	addCustomer: function(){
		this.router.navigate('customer/add',{trigger: true});
		return false;
	},

	editCustomer: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('customer/edit/'+ id,{trigger: true});
		return false;
	},

	removeCustomer: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).parent().attr('id');
			var model = new Customer({_id: id});
			model.destroy({wait: true});
			this.listView.trigger('refresh',model.urlRoot);
		}
		return false;
	},

	importCustomer: function(){
		this.router.navigate('customer/import',{trigger: true});
		return false;
	},

	exportCustomer: function(){
		this.router.navigate('customer/export',{trigger: true});
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