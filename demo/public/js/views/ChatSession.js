define(['text!templates/_layout_1.html','text!templates/chatsession.html','models/Chat','models/ChatCollection'], function(layoutTemplate,chatSessionTemplate,Chat,ChatCollection){
	var ChatSessionView = Backbone.View.extend({
		template: _.template(chatSessionTemplate),
		el: $('#content'),
		// tagName: 'div',
		className: 'chat_session',

		events: {
			'submit form': 'sendChat'
		},

		initialize: function(options){
			this.room = options.room;
			this.listenTo(this.collection,'add', this.onChatAdded);
			this.listenTo(this.collection, 'reset', this.onChatCollectionReset);
			this.socketEvents = options.socketEvents;
			this.socketEvents.on(
					'socket:chat:in:' + this.room.get('accountId'),
					this.receiveChat, 
					this
				);
		},
		sendChat: function(){
			var chatText = $('input[name=chat]').val();
			if(chatText && /[^\s]+/.test(chatText)){
				// var chatLine = '我：' + chatText;
				// this.$el.find('.chat_log').append('<li>' + chatLine + '</li>');
				var chat = new Chat({
					from: {
						username: '我：'
					},
					to: this.room.get('accountId'),
					text: chatText,
				});
				this.collection.push(chat.toJSON());
				//TODO 
				// console.log('有重复发送问题，待查')
				this.socketEvents.trigger('socket:chat',{
					action: 'chat',
					to: this.room.get('accountId'),
					text: chatText
				});

			}
			return false;
		},

		receiveChat: function(data){
			var chat = new Chat({
				from: {
					username: data.username
				},
				// to: this.room.get('accountId'),
				text: data.text,
			});
			this.collection.push(chat);
		},

		onChatAdded: function(chat){
			var chatLine = chat.get('from')['username']  + ': ' + chat.get('text');
			this.$el.find('.chat_log').append('<li>' + chatLine + '</li>');
		},

		onChatCollectionReset: function(collection){
			var that = this;
			$('.chat_log').empty();
			collection.each(function(chat){
				that.onChatAdded(chat);
			});
		},

		render: function(roomId){
			if(roomId){
				var collectionInRoom = new ChatCollection(this.collection.where({roomId: roomId}));
				this.onChatCollectionReset(collectionInRoom);
			}else{
				this.$el.html(layoutTemplate);
				this.$el.find('#main').html(this.template({room: this.room.toJSON()}));

			}
			return this;
		}
	});
	return ChatSessionView;
});