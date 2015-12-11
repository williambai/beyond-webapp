var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    goodsTpl = require('../templates/_entityGoodsEntity.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');

Backbone.$ = $;

var GoodsEntity = require('../models/GoodsEntity');
var ListView = require('./_GoodsEntityList');
var SearchView = require('./_GoodsEntitySearch');

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(goodsTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .add': 'addGoodsEntity',
		'click .edit': 'editGoodsEntity',
		'click .delete': 'removeGoodsEntity',
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
	
	addGoodsEntity: function(){
		this.router.navigate('goods/add',{trigger: true});
		return false;
	},

	editGoodsEntity: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('goods/edit/'+ id,{trigger: true});
		return false;
	},

	removeGoodsEntity: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).parent().attr('id');
			var model = new GoodsEntity({_id: id});
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