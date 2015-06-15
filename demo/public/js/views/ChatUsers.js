define(['text!templates/chatusers.html','views/ChatUser','views/Chat','models/ChatCollection'],
	function(ChatUsersTemplate,ChatUserView,ChatView,ChatCollection){

	var ChatUsersView = Backbone.View.extend({
		template: _.template(ChatUsersTemplate),
		el: '#chat',

		initialize: function(options){
			this.socketEvents = options.socketEvents;
			this.collection.on('reset', this.onCollectionReset, this);
			this.currentChatView = options.currentChatView;
			this.chats = options.chats;
		},

		onContactAdded: function(contact){
			var chatUserView = new ChatUserView({
				model: contact,
				socketEvents: this.socketEvents
			});
			chatUserView.bind('chat:start', this.startChat, this);
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
		// currentChatView: null,
		// chats: {},
		startChat: function(model){
			if(null != this.currentChatView){
				this.currentChatView.undelegateEvents();
			}
			
			var roomId = model.get('accountId');
			if(!this.chats[roomId]){
				var chatCollection = new ChatCollection();
				var chatView = new ChatView({
						room: model,
						collection: chatCollection,
						socketEvents: this.socketEvents
					});
				chatView.render();
				chatCollection.url = '/chats/' + roomId;
				chatCollection.fetch({reset:true});
				this.chats[roomId] = chatView;
			}else{
				var view = this.chats[roomId];
				view.delegateEvents();
				view.render();
				var collection = view.collection;
				collection.trigger('reset',collection);
			}

			this.currentChatView = this.chats[roomId];
		}
	});
	return ChatUsersView;
});