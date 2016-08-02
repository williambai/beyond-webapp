var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    productTpl = require('../templates/_entityProductPhonePackage.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var ProductPhonePackage = require('../models/ProductPhonePackage');
var ListView = require('./_ProductPhonePackageList');
var SearchView = require('./_ProductPhonePackageSearch');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		this.pid = options.pid;
		var page = $(productTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .add': 'addProductPhonePackage',
		'click .edit': 'editProductPhonePackage',
		'click .delete': 'removeProductPhonePackage',
		'click .back': 'back',
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
			pid: this.pid,
		});
		this.searchView.trigger('load');
		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},
	
	addProductPhonePackage: function(){
		this.router.navigate('product/phone/'+ this.pid +'/package/add',{trigger: true});
		return false;
	},

	editProductPhonePackage: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('product/phone/'+ this.pid +'/package/edit/'+ id,{trigger: true});
		return false;
	},

	removeProductPhonePackage: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).parent().attr('id');
			var model = new ProductPhonePackage({_id: id,pid: this.pid});
			model.destroy({wait: true});
			this.listView.trigger('refresh');
		}
		return false;
	},

	back: function(){
		window.history.back();
		return;
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