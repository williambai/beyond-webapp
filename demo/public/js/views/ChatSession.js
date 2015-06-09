define(['text!templates/chatsession.html','views/ChatItem','models/Chat','models/ChatCollection'], function(chatSessionTemplate,ChatItemView,Chat,ChatCollection){
	var ChatSessionView = Backbone.View.extend({
		template: _.template(chatSessionTemplate),
		el: '#content',
		className: 'chat_session',

		events: {
			'submit form': 'sendChat'
		},

		initialize: function(options){
			this.room = options.room;
			this.listenTo(this.collection, 'reset', this.onChatCollectionReset);
			this.socketEvents = options.socketEvents;
			this.socketEvents.on(
					'socket:chat:in:' + this.room.get('accountId'),
					this.socketReceiveChat, 
					this
				);
		},
		sendChat: function(){
			var chatText = $('input[name=chat]').val();
			if(chatText && /[^\s]+/.test(chatText)){
				var chatObject = {
					fromId: 'me',
					toId: this.room.get('accountId'),
					username: '我：',
					avatar: '',
					status: chatText
				};
				var chat = new Chat(chatObject);
				this.collection.add(chat);
				this.onChatAdded(chat);

				this.socketEvents.trigger('socket:chat',{
					action: 'chat',
					to: this.room.get('accountId'),
					text: chatText
				});
			}
			$('input[name=chat]').val('');
			return false;
		},

		socketReceiveChat: function(socket){
			var chat = new Chat({
				fromId: socket.from,
				toId: this.room.get('accountId'),
				username: socket.data.username,
				avatar: socket.data.avatar,
				status: socket.data.text,
			});
			this.collection.add(chat);
			this.onChatAdded(chat);
		},

		onChatAdded: function(chat){
			var chatItemHtml = (new ChatItemView({model: chat})).render().el;
			$(chatItemHtml).appendTo('.chat_log').hide().fadeIn('slow');
			this.$el.animate({scrollTop: this.$el.get(0).scrollHeight});
		},

		onChatCollectionReset: function(collection){
			var that = this;
			$('.chat_log').empty();
			collection.each(function(chat){
				var chatItemHtml = (new ChatItemView({model: chat})).render().el;
				$(chatItemHtml).appendTo('.chat_log').hide().fadeIn('fast');
			});
			this.$el.animate({scrollTop: this.$el.get(0).scrollHeight});
		},

		render: function(roomId){
			if(roomId){
				var collectionInRoom = new ChatCollection(this.collection.where({roomId: roomId}));
				this.onChatCollectionReset(collectionInRoom);
			}else{
				this.$el.html(this.template({room: this.room.toJSON()}));

			}
			return this;
		}
	});
	return ChatSessionView;
});