define(['text!templates/chatuser.html'],function(ChatUserTemplate){
	var ChatUserView = Backbone.View.extend({
		tagName: 'div',
		template: _.template(ChatUserTemplate),

		messageUnreadNum: 0, //未读消息数量

		events: {
			'click': 'startChatSession'
		},

		initialize: function(options){
			var accountId = this.model.get('accountId');
			this.socketEvents = options.socketEvents;

			options.socketEvents.bind(
					'login:'+ accountId,
					this.handleContactLogin,
					this
				);
			options.socketEvents.bind(
					'logout:' + accountId,
					this.handleContactLogout,
					this				
				);
			options.socketEvents.bind(
					'socket:chat:in:' + this.model.get('accountId'),
					this.onMessageRecieved,
					this
				);
			// options.socketEvents.bind(
			// 		'socket:chat:start:' + this.model.get('accountId'),
			// 		this.startChatSession,
			// 		this
			// 	);
		},

		handleContactLogin: function(eventObj){
			this.model.set('online', true);
			this.$el.find('.label').addClass('label-success').html('<i>在线</i>');
		},

		handleContactLogout: function(eventObj){
			this.model.set('online', false);
			this.$el.find('.label').removeClass('label-success').html('<i>离线</i>');
		},

		onMessageRecieved: function(socket){
			++this.messageUnreadNum;
			this.renderMessageNum();
			this.socketEvents.trigger('chat:number:total',1);
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
			this.$el.html(this.template({model: this.model.toJSON()}));
			if(this.model.get('online')){
				this.handleContactLogin();
			}

			return this;
		}
	});
	return ChatUserView;
});