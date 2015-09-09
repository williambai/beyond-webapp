var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    projectItemTemplate = require('../../assets/templates/_itemProject.tpl');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	tagName: 'div',
	messageUnreadNum: 0,

	events: {
		'click .list-group-item': 'activeItem',
	},

	initialize: function(options){
		this.socketEvents = options.socketEvents;
		options.socketEvents.bind(
				'socket:in:project:notification:' + this.model.get('_id'),
				this.onMessageRecieved,
				this
			);
	},
	
	activeItem: function(evt){
		var currentItem = evt.currentTarget;
		this.messageUnreadNum = 0;
		this.renderMessageNum();
	},

	onMessageRecieved: function(){
		if(this.$('.active').length == 0){
			this.messageUnreadNum += 1;
			this.renderMessageNum();
		}
	},

	renderMessageNum: function(){
		if(this.messageUnreadNum < 1) {
			this.messageUnreadNum = 0;
			this.$('.project-chat-unread').html('<i class="fa fa-chevron-right"></i>');
		}else{
			this.$('.project-chat-unread').html('<span class="badge">' + this.messageUnreadNum + '</span>');
		}
	},

	render: function(){
		this.$el.html(projectItemTemplate(this.model.toJSON()));
		return this;
	}
});