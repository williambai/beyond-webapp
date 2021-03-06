var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    chatUserTemplate = require('../templates/_itemChatUser.tpl');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	tagName: 'div',

	messageUnreadNum: 0, //未读消息数量

	events: {
		'click': 'startChatSession'
	},

	initialize: function(options){
		var accountId = this.model.get('accountId');
		this.socketEvents = options.socketEvents;

		options.socketEvents.bind(
				'socket:in:login:'+ accountId,
				this.handleFriendLogin,
				this
			);
		options.socketEvents.bind(
				'socket:in:logout:' + accountId,
				this.handleFriendLogout,
				this				
			);
		options.socketEvents.bind(
				'socket:in:chat:' + accountId,
				this.onMessageRecieved,
				this
			);
	},

	handleFriendLogin: function(eventObj){
		this.model.set('online', true);
		this.$el.find('.label').addClass('label-success').html('<i>在线</i>');
	},

	handleFriendLogout: function(eventObj){
		this.model.set('online', false);
		this.$el.find('.label').removeClass('label-success').html('<i>离线</i>');
	},

	onMessageRecieved: function(data){
		++this.messageUnreadNum;
		this.renderMessageNum();
	},

	renderMessageNum: function(){
		this.messageUnreadNum = this.messageUnreadNum < 0 ? 0 : this.messageUnreadNum;
		if(this.messageUnreadNum<1){
			this.$('.message-unread').text('');
		}else{
			this.$('.message-unread').text(this.messageUnreadNum);
		}
	},

	startChatSession: function(){
		this.socketEvents.trigger('chat:number:total',-this.messageUnreadNum);
		this.messageUnreadNum = 0;
		this.renderMessageNum();
		window.location.hash = 'chat/' + this.model.get('accountId');
		// return false;
		// this.trigger('chat:start', this.model);
	},

	render: function(){
		this.$el.html(chatUserTemplate({model: this.model.toJSON()}));
		if(this.model.get('online')){
			this.handleFriendLogin();
		}

		return this;
	}
});