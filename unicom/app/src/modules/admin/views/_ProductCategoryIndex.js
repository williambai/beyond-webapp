var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    categoryTpl = require('../templates/_entityProductCategory.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var ListView = require('./_ProductCategoryList');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(categoryTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .add': 'addProductCategory',
		'click .edit': 'editProductCategory',
		'click .delete': 'removeProductCategory',
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
	addProductCategory: function(){
		this.router.navigate('product/category/add',{trigger: true});
		return false;
	},

	editProductCategory: function(evt){
		var id = this.$(evt.currentTarget).closest('.item').attr('id');
		this.router.navigate('product/category/edit/'+ id,{trigger: true});
		return false;
	},

	removeProductCategory: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).closest('.item').attr('id');
			var model = new ProductCategory({_id: id});
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