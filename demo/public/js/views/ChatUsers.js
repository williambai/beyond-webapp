define(['text!templates/chatusers.html','views/ChatUser','views/ChatSession'],
	function(ChatUsersTemplate,ChatUserView,ChatSessionView){

	var ChatUsersView = Backbone.View.extend({
		template: _.template(ChatUsersTemplate),
		el: $('#chat'),

		initialize: function(options){
			this.socketEvents = options.socketEvents;
			this.collection.on('reset', this.onCollectionReset, this);
		},

		onContactAdded: function(contact){
			var chatUserView = new ChatUserView({
				model: contact,
				socketEvents: this.socketEvents
			});
			chatUserView.bind('chat:start', this.startChatSession, this);
			var chatUserHtml = chatUserView.render().el;
			$(chatUserHtml).appendTo('.chat_list');
		},

		onCollectionReset: function(collection){
			var that = this;
			$('.chat_list').empty();
			collection.each(function(contact){
				that.onContactAdded(contact);
			});
		},
		render: function(){
			this.$el.html(this.template());
			return this;
		},
		chatSessions: {},
		startChatSession: function(model){
			var accountId = model.get('accountId');
			if(!this.chatSessions[accountId]){
				var chatSessionView = new ChatSessionView({
					model: model,
					socketEvents: this.socketEvents
				});
				chatSessionView.render();
				// this.$el.prepend(chatSessionView.render().el);
				this.chatSessions[accountId] = chatSessionView;
			}else{
				this.chatSessions[accountId].render();
			}
		}
	});
	return ChatUsersView;
});