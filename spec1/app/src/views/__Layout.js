var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    layoutTemplate = require('../templates/__layout.tpl'),
    loadingTemplate = require('../templates/loading.tpl');
var Badge = require('../models/BadgeLocal');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: 'body',

	badge: {},

	loaded: false,
	initialize: function(options){
		this.badge = new Badge();
		this.badge.on('change',this.badgeRender,this);

		this.appEvents = options.appEvents;


		this.$el
			.addClass('has-sidebar-left')
			.addClass('has-sidebar-right')
			.addClass('has-navbar-top');
		this.appEvents.on('set:brand', this.updateBrand,this);
		this.on('load', this.load,this);
	},

	events: {
		'click .list-group-item': 'activeItem',
		'click #left-sidebar-toggle': 'leftSideBarToggle',
		'click #right-sidebar-toggle': 'rightSideBarToggle',
		'click .sidebar-left': 'closeLeftSideBar',
		'click .sidebar-right': 'closeRightSideBar',
	},

	load: function(){
		this.loaded = true;
		this.render();
		this.badge.fetch();
	},

	activeItem: function(evt){
		var currentItem = evt.currentTarget;
		this.$('.list-group-item').removeClass('active');
		this.$(currentItem).addClass('active');
		if(this.$(currentItem).find('.status-unread').length > 0){
			this.badge.set('statusUnreadNum', 0);
			// this.$('.status-unread').html('<i class="fa fa-chevron-right"></i>');
		}else if(this.$(currentItem).find('.message-unread').length > 0){
			this.badge.set('messageUnreadNum', 0);
			// this.$('.message-unread').html('<i class="fa fa-chevron-right"></i>');
		}
		this.badge.save();
	},

	leftSideBarToggle: function(){
		var visible = this.$el.hasClass('sidebar-left-visible');
		if(!visible){
			this.$el
				.addClass('sidebar-left-in')
				.addClass('sidebar-left-visible');
		}else{
			this.$el
				.removeClass('sidebar-left-in')
				.removeClass('sidebar-left-visible');
		}
		// return false;
	},

	rightSideBarToggle: function(){
		var visible = this.$el.hasClass('sidebar-right-visible');
		if(!visible){
			this.$el
				.addClass('sidebar-right-in')
				.addClass('sidebar-right-visible');
		}else{
			this.$el
				.removeClass('sidebar-right-in')
				.removeClass('sidebar-right-visible');
		}
		// return false;
	},

	closeLeftSideBar: function(){
		this.leftSideBarToggle();
	},

	closeRightSideBar: function(){
		this.rightSideBarToggle();
	},

	updateBrand: function(brand){
		this.$('.navbar-brand').text(brand || '');
	},

	onChatIn: function(){
		var chatUnreadNum = this.badge.get('chatUnreadNum') + 1;
		this.badge.set('chatUnreadNum', chatUnreadNum);
		this.badge.save();
	},

	onMessageIn: function(data){
		var messageUnreadNum = this.badge.get('messageUnreadNum') + 1;
		this.badge.set('messageUnreadNum',messageUnreadNum);
		this.badge.save();
	},

	onStatusIn: function(data){
		var statusUnreadNum = this.badge.get('statusUnreadNum') + 1;
		this.badge.set('statusUnreadNum', statusUnreadNum);
		this.badge.save();
	},

	badgeRender: function(){
		var chatUnreadNum = this.badge.get('chatUnreadNum');
		if(chatUnreadNum < 1) {
			chatUnreadNum = 0;
			this.$('.chat-total-unread').text('');
		}else{
			this.$('.chat-total-unread').text(chatUnreadNum);
		}
		var messageUnreadNum = this.badge.get('messageUnreadNum');
		if(messageUnreadNum < 1) {
			messageUnreadNum = 0;
			this.$('.message-unread').html('<i class="fa fa-chevron-right"></i>');
		}else{
			this.$('.message-unread').html('<span class="badge">' + messageUnreadNum + '</span>');
		}
		var statusUnreadNum = this.badge.get('statusUnreadNum');
		if(statusUnreadNum < 1) {
			statusUnreadNum = 0;
			this.$('.status-unread').html('<i class="fa fa-chevron-right"></i>');
		}else{
			this.$('.status-unread').html('<span class="badge">' + statusUnreadNum + '</span>');
		}
	},

	render: function(){
		if(!this.loaded){
			this.$el.html(loadingTemplate());
		}else{
			this.$el.html(layoutTemplate());
		}
		return this;
	}
});