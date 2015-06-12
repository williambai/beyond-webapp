define(['text!templates/chatsession.html','views/ChatItem','models/Chat','models/ChatCollection'], function(chatSessionTemplate,ChatItemView,Chat,ChatCollection){
	var ChatSessionView = Backbone.View.extend({
		template: _.template(chatSessionTemplate),
		el: '#content',
		className: 'chat_session',

		events: {
			'submit form': 'sendChat'
		},

		initialize: function(options){
			this.id = options.id;
			this.account = options.account;
			this.socketEvents = options.socketEvents;
			this.socketEvents.on(
					// 'socket:chat:in:' + this.room.get('accountId'),
					'socket:chat:in:' + this.id,
					this.socketReceiveChat, 
					this
				);
			this.collection = new ChatCollection();
			this.collection.url = '/chats/' + this.id;
			this.listenTo(this.collection, 'reset', this.onChatCollectionReset);
			this.on('load', this.load, this);
		},

		load: function(){
			this.render();
			this.collection.fetch({reset:true});
		},

		sendChat: function(){
			var chatText = $('input[name=chat]').val();
			if(chatText && /[^\s]+/.test(chatText)){
				var chatObject = {
					fromId: 'me',
					toId: this.id,
					username: '我：',
					avatar: this.account.avatar,
					status: chatText
				};
				var chat = new Chat(chatObject);
				this.collection.add(chat);
				this.onChatAdded(chat);

				this.socketEvents.trigger('socket:chat',{
					action: 'chat',
					to: this.id,
					text: chatText
				});
			}
			$('input[name=chat]').val('');
			return false;
		},

		socketReceiveChat: function(socket){
			var fromId = socket.from;
			var toId = this.id;
			var chat = new Chat({
				fromId: fromId,
				toId: toId,
				username: socket.data.username,
				avatar: socket.data.avatar,
				status: socket.data.text,
			});
			this.collection.add(chat);
			this.onChatAdded(chat);
		},

		onChatAdded: function(chat){
			var fromId = chat.get('fromId');
			if(fromId != this.id) {
				chat.set('fromId','me');
			}
			var chatItemHtml = (new ChatItemView({model: chat})).render().el;
			$(chatItemHtml).appendTo('.chat_log').hide().fadeIn('slow');
			this.$el.animate({scrollTop: this.$el.get(0).scrollHeight});
		},

		onChatCollectionReset: function(collection){
			var that = this;
			$('.chat_log').empty();
			collection.each(function(chat){
				var fromId = chat.get('fromId');
				if(fromId != that.id) {
					chat.set('fromId','me');
				}
				var chatItemHtml = (new ChatItemView({model: chat})).render().el;
				$(chatItemHtml).prependTo('.chat_log').hide().fadeIn('fast');
			});
			this.$el.animate({scrollTop: this.$el.get(0).scrollHeight});
		},

		render: function(){
			this.$el.html(this.template());
			return this;
		}
	});
	return ChatSessionView;
});