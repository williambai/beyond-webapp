var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    productTpl = require('../templates/_entityProductDirect.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var ProductDirect = require('../models/ProductDirect');
var ListView = require('./_ProductDirectList');
var SearchView = require('./_ProductDirectSearch');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(productTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .add': 'addProductDirect',
		'click .edit': 'editProductDirect',
		'click .delete': 'removeProductDirect',
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
	
	addProductDirect: function(){
		this.router.navigate('product/direct/add',{trigger: true});
		return false;
	},

	editProductDirect: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('product/direct/edit/'+ id,{trigger: true});
		return false;
	},

	removeProductDirect: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).parent().attr('id');
			var model = new ProductDirect({_id: id});
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