var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
    carouselTpl = require('../templates/_entityCarousel.tpl'),
	loadingTpl = require('../templates/__loading.tpl');
var config = require('../conf');
var ListView = require('./__ListView');

Backbone.$ = $;

//** 模型
var Carousel = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/carousels',
	defaults: {
		display_sort: 0,
	}
});

//** 集合
var CarouselCollection = Backbone.Collection.extend({
	url: config.api.host + '/carousels',
	model: Carousel,
});

//** list子视图
var CarouselListView = ListView.extend({
	el: '#list',

	initialize: function(options){
		var page = $(carouselTpl);
		var itemTemplate = $('#itemTemplate', page).html();
		this.template = _.template(_.unescape(itemTemplate || ''));
		this.collection = new CarouselCollection();
		ListView.prototype.initialize.apply(this,options);
	},
	getNewItemView: function(model){
		var item = this.template({model: model.toJSON()});
		var $item = $(item);
		$item.find('img').attr('src', model.get('img_url'));
		return $item.html();
	},
});

//** 主视图
exports = module.exports = Backbone.View.extend({

	el: '#content',

	loadingTemplate: _.template(loadingTpl),

	initialize: function(options) {
		this.router = options.router;
		var page = $(carouselTpl);
		var indexTemplate = $('#indexTemplate', page).html();
		this.template = _.template(_.unescape(indexTemplate || ''));
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .add': 'addCarousel',
		'click .edit': 'editCarousel',
		'click .delete': 'removeCarousel',
	},

	load: function() {
		var that = this;
		this.loaded = true;
		this.render();

		this.listView = new CarouselListView({
			el: '#list',
		});
		this.listView.trigger('load');
	},

	scroll: function() {
		this.listView.scroll();
		return false;
	},
	
	addCarousel: function(){
		this.router.navigate('carousel/add',{trigger: true});
		return false;
	},

	editCarousel: function(evt){
		var id = this.$(evt.currentTarget).closest('.item').attr('id');
		this.router.navigate('carousel/edit/'+ id,{trigger: true});
		return false;
	},

	removeCarousel: function(evt){
		if(window.confirm('您确信要删除吗？')){
			var id = this.$(evt.currentTarget).closest('.item').attr('id');
			var model = new Carousel({_id: id});
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