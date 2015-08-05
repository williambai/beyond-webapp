define(['views/_ItemChatUser','views/Chat','models/ContactCollection','models/ChatCollection'],
	function(ChatUserView,ChatView,ContactCollection,ChatCollection){

	var ChatUsersView = Backbone.View.extend({
		el: '#chat',
		loaded: false,

		initialize: function(options){
			this.socketEvents = options.socketEvents;
			this.collection = new ContactCollection();
			this.collection.url = '/accounts/me/contacts';
			this.collection.on('reset', this.onCollectionReset, this);
			this.on('load', this.load, this);

			this.currentChatView = options.currentChatView;
			this.chats = options.chats;
		},
		load: function(){
			this.loaded = true;
			this.collection.fetch({reset:true});
		},
		onContactAdded: function(contact){
			var chatUserView = new ChatUserView({
				model: contact,
				socketEvents: this.socketEvents
			});
			chatUserView.bind('chat:start', this.startChat, this);
			var chatUserHtml = chatUserView.render().el;
			this.$el.append(chatUserHtml);
		},

		onCollectionReset: function(collection){
			var that = this;
			that.$el.empty();
			collection.each(function(contact){
				that.onContactAdded(contact);
			});
		},
		render: function(){
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