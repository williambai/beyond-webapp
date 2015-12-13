var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    dataTpl = require('../templates/_entityPromoteProduct.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var PromoteProduct = require('../models/PromoteProduct');
var ListView = require('./_PromoteProductList');
var SearchView = require('./_PromoteProductSearch');

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
		'click .add': 'addPromoteProduct',
		'click .edit': 'editPromoteProduct',
		'click .delete': 'removePromoteProduct',
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
	
	addPromoteProduct: function(){
		this.router.navigate('promote/product/add',{trigger: true});
		return false;
	},

	editPromoteProduct: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('promote/product/edit/'+ id,{trigger: true});
		return false;
	},

	removePromoteProduct: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).parent().attr('id');
			var model = new PromoteProduct({_id: id});
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