var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    cardTpl = require('../templates/_entityProductCard.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var ProductCard = require('../models/ProductCard');
var ListView = require('./_ProductCardList');
var SearchView = require('./_ProductCardSearch');

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
		'click .add': 'addProductCard',
		'click .edit': 'editProductCard',
		'click .delete': 'removeProductCard',
		'click .import': 'importProductCard',
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
	
	addProductCard: function(){
		this.router.navigate('product/card/add',{trigger: true});
		return false;
	},

	editProductCard: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('product/card/edit/'+ id,{trigger: true});
		return false;
	},

	removeProductCard: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).parent().attr('id');
			var model = new ProductCard({_id: id});
			model.destroy({wait: true});
			this.listView.trigger('refresh');
		}
		return false;
	},

	importProductCard: function(){
		this.router.navigate('product/card/import',{trigger: true});
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