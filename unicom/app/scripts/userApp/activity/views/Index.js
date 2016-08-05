var _ = require('underscore');
var $ = require('jquery');
var	Backbone = require('backbone');
var config = require('../../conf');
var Utils = require('../../_base/__Util');

Backbone.$ = $;

//** Activity模型
var Activity = Backbone.Model.extend({
	idAttribute: '_id',
	urlRoot: config.api.host + '/public/account/activities',	
	defaults: {
	}
});

//** Activity集合
var ActivityCollection = Backbone.Collection.extend({
	model: Activity,
	url: config.api.host + '/public/account/activities',
});

//** 列表视图
var ActivityItemView = Backbone.View.extend({
	tagName: 'div',
	className: 'item',
	template: _.template($('#tpl-activity-item').html()),

	initialize: function(options){

	},
	_convertContent: function(model){
		var type = model.get('type');
		var contentObject = model.get('content');
		var newContent = Utils.buildContent(type, contentObject);
		model.set('content',newContent);
	},

	_transformTime: function(model){
		var createtime = model.get('lastupdatetime');
		var deltatime = Utils.transformTime(createtime);
		model.set('deltatime', deltatime);
	},

	render: function(){
		this._convertContent(this.model);
		this._transformTime(this.model);
		this.$el.html(this.template({model: this.model.toJSON()}));
		return this;
	},
});

//** 主模型
var IndexModel = Backbone.Model.extend({
	initialize: function(){
		this.activities = new ActivityCollection();
		this.activities.url = config.api.host + '/public/account/activities';
		this.activities.on('reset', this.activitiesReset, this);
	},
	activitiesReset: function(){
		this.trigger('change');
	},
});

//** 主视图
var IndexView = Backbone.View.extend({

	el: '#content',
	template: _.template($('#tpl-activity-index').html()),

	initialize: function(options) {
		this.router = options.router;
		this.model = new IndexModel();
		this.model.on('change', this.render, this);
		this.on('load', this.load, this);
	},

	events: {
		'scroll': 'scroll',
		'click .view': 'activityView',
	},

	load: function() {
		this.model.activities.fetch({reset: true});
	},
	
	page: 0,
	hasmore: true,

	nextPage: function() {
		var that = this;
		if (this.hasmore) {
			if (this.$('.load-more').length == 0) {
				this.$el.append('<div class="load-more text-center"><p><i class="fa fa-spinner fa-pulse"></i>&nbsp;加载中...</p></div>');
			}
			++this.page;
			$.ajax({
				url: config.api.host + '/public/account/activities', //** 短连接地址
				type: 'GET',
				xhrFields: {
					withCredentials: true
				},
				data: {
					page: that.page,
				},
				crossDomain: true,
			}).done(function(activities) {
				if (that.$('.load-more').length > 0) {
					that.$('.load-more').remove();
				}
				if (activities.length == 0) {
					that.$el.append('<div class="load-more text-center"><p>没有更多内容啦</p></div>');
					that.hasmore = false;
				} else {
					_.each(activities, function(activity){
						var itemView = new ActivityItemView({model: new Activity(activity)});
						itemView.render().$el.appendTo('#list');
						itemView.$el.find('img').attr('src', activity.avatar || '');
					});
					that.hasmore = true;
				}
			}).fail(function(){
				if (that.$('.load-more').length > 0) {
					that.$('.load-more').remove();
				}
				that.hasmore = false;
			});
		} else {
			if (that.$('.load-more').length == 0) {
				that.$el.append('<div class="load-more text-center"><p>没有更多内容啦</p></div>');
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
		return false;
	},

	activityView: function(evt){
		var id = this.$(evt.currentTarget).parent().attr('id');
		this.router.navigate('activity/view/'+ id,{trigger: true});
		return false;
	},
	render: function() {
		this.$el.html(this.template());
		var activities = this.model.activities;
		activities.each(function(activity){
			var itemView = new ActivityItemView({model: activity});
			itemView.render().$el.appendTo('#list');
			itemView.$el.find('img').attr('src', activity.get('avatar'));
		});
		return this;
	},
});
exports = module.exports = IndexView;