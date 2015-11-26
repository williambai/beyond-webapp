var _ = require('underscore');
var $ = require('jquery'),
	Backbone = require('backbone'),
	loadMoreTemplate = _.template(require('../templates/__load-more.tpl'));


Backbone.$ = $;

exports = module.exports = Backbone.View.extend({
	el: '#list',

	isScrollUp: false, //默认向下滚动
	contentH: 0, //向上滚动需要

	page: 0,
	hasmore: true,
	collectionUrl: '',

	initialize: function(options) {
		// this.collectionUrl = this.collection.url;
		this.collection.on('reset', this.onCollectonAppend, this);
		this.collection.on('update', this.onCollectonAppend, this);
		this.on('append', this.onModelAppend, this);
		this.on('prepend', this.onModelPrepend, this);
		this.on('load', this.load, this);
		this.on('refresh', this.refresh, this);
		this.on('scroll:up', this.scrollUp, this);
		this.on('scroll:down', this.scroll, this);
	},

	load: function() {
		this.loaded = true;
		this.render();
		this.collection.fetch({
			reset: true,
			xhrFields: {
				withCredentials: true
			},
		});
	},

	refresh: function(url) {
		this.$el.empty();
		this.collection.url = url;
		// this.collectionUrl = this.collection.url;
		this.collection.fetch({
			reset: true,
			xhrFields: {
				withCredentials: true
			},
		});
	},

	onCollectonAppend: function(collection) {
		var that = this;
		if (that.isScrollUp) {
			collection.each(function(model) {
				var itemHtml = that.getNewItemView(model);
				that.$el.prepend(itemHtml);
				that.collection.add(model, {
					at: 0
				});
			});
			that.contentH = that.$el.get(0).scrollHeight - that.contentH;
			$('#content').animate({
				scrollTop: that.contentH
			}, 1);
		} else {
			collection.each(function(model) {
				var itemHtml = that.getNewItemView(model);
				that.$el.append(itemHtml);
			});
		}
	},

	onModelAppend: function(model) {
		var itemHtml = this.getNewItemView(model);
		this.$el.append(itemHtml);
		return this;
	},

	onModelPrepend: function(model) {
		var itemHtml = this.getNewItemView(model);
		this.$el.prepend(itemHtml);
	},

	nextPage: function() {
		var that = this;
		if (this.hasmore) {
			if (this.$('.load-more').length == 0) {
				this.$el.append(loadMoreTemplate({
					loading: true
				}));
			}
			++this.page;
			this.collection.fetch({
				xhrFields: {
					withCredentials: true
				},
				data: {
					page: that.page,
				},
				success: function(collection, response) {
					if (that.$('.load-more').length > 0) {
						that.$('.load-more').remove();
					}
					if (collection.length == 0) {
						that.$el.append(loadMoreTemplate({
							loading: false
						}));
						that.hasmore = false;
					} else {
						that.collection.add(collection.models);
						that.hasmore = true;
					}
				},
				error: function(collection, response) {
					if (that.$('.load-more').length > 0) {
						that.$('.load-more').remove();
					}
					that.hasmore = false;
				}
			});
		} else {
			if (that.$('.load-more').length == 0) {
				that.$el.append(loadMoreTemplate({
					loading: false
				}));
			}
		}
	},

	prevPage: function() {
		var that = this;
		if (this.hasmore) {
			if (this.$('.load-more').length == 0) {
				this.$el.prepend(loadMoreTemplate({
					loading: true
				}));
			}
			++this.page;
			this.collection.fetch({
				xhrFields: {
					withCredentials: true
				},
				data: {
					page: that.page,
				},
				success: function(collection, response) {
					if (that.$('.load-more').length > 0) {
						that.$('.load-more').remove();
					}
					if (collection.length == 0) {
						that.$el.prepend(loadMoreTemplate({
							loading: false
						}));
						that.hasmore = false;
					} else {
						that.collection.add(collection.models);
						that.hasmore = true;
					}
				},
				error: function(collection, response) {
					if (that.$('.load-more').length > 0) {
						that.$('.load-more').remove();
					}
					that.hasmore = false;
				}
			});
		} else {
			if (that.$('.load-more').length == 0) {
				that.$el.prepend(loadMoreTemplate({
					loading: false
				}));
			}
		}
	},

	scroll: function() {
		var scrollTop = $('#content').scrollTop(); //可滚动容器的当前滚动高度  
		var viewH = $(window).height(); //当前window可见高度  
		var contentH = this.$el.get(0).scrollHeight; //内容高度  
		// console.log(contentH + '-' + viewH + '-' + scrollTop);
		if (contentH - viewH - scrollTop <= 100) { //到达底部100px时,加载新内容
			this.nextPage();
		}
	},

	scrollUp: function() {
		var scrollTop = $('#content').scrollTop(); //滚动高度  
		// var viewH =$(window).height();//当前window可见高度  
		// var contentH =this.$el.get(0).scrollHeight;//内容高度  
		// console.log(contentH + '-' + viewH + '-' + scrollTop);
		if (scrollTop <= 100) {
			this.prevPage();
		}
	},

	render: function() {
		return this;
	},

});