var _ = require('underscore');

var $ = require('jquery'),
    Backbone = require('backbone'),
    loadingTemplate = require('../../assets/templates/loading.tpl'),
    notificationTemplate = require('../../assets/templates/notification.tpl'),
    NotificationListView = require('./_ListNotification');
var config = require('../conf');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	loaded: false,

	events: {
		'scroll': 'scroll',
	},

	initialize: function(options){
		this.account = options.account;
		this.socketEvents = options.socketEvents;
		if(options.socketEvents){
			options.socketEvents.on('socket:in:notification',this.onSocketStatusAdded, this);
		}
		this.on('load', this.load, this);
	},

	load: function(){
		this.loaded = true;
		this.render();
		this.notificationListView = new NotificationListView({
			url: config.api.host + '/notifications',
			account: this.account,
		});
		this.notificationListView.trigger('load');
	},

	scroll: function(){
		this.notificationListView.scroll();
		return false;
	},

	onSocketStatusAdded: function(data){
		// var from = data.from;
		// var content = data.content;
		// var status = {};
		// status.fromId = from.id;
		// status.fromUser = {};
		// status.fromUser[from.id] = from;
		// status.content = content;
		// this.notificationListView.trigger('prepend',status);
	},
	
	render: function(){
		if(!this.loaded){
			this.$el.html(loadingTemplate());
		}else{
			this.$el.html(notificationTemplate());
		}
		return this;
	},
});