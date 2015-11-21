var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    layoutTemplate = require('../templates/__layout.tpl'),
    loadingTemplate = require('../templates/loading.tpl');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: 'body',
	loaded: false,
	initialize: function(options){
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
	},

	activeItem: function(evt){
		var currentItem = evt.currentTarget;
		this.$('.list-group-item').removeClass('active');
		this.$(currentItem).addClass('active');
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

	render: function(){
		if(!this.loaded){
			this.$el.html(loadingTemplate());
		}else{
			this.$el.html(layoutTemplate());
		}
		return this;
	}
});