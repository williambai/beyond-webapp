define(['text!/templates/bottomBar1.html', 'models/Chat'],function(bottomBarTemplate, Chat){
	var BottomBarView = Backbone.View.extend({
		className: 'bottom-bar',

		template: _.template(bottomBarTemplate),

		initialize: function(options){				
			this.id = options.id;
			this.account = options.account;
			this.socketEvents = options.socketEvents;
			this.parentView = options.parentView;
		},

		events: {
			'submit form': 'sendChat'
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
				this.parentView.collection.add(chat);
				this.parentView.onChatAdded(chat);

				this.socketEvents.trigger('socket:chat',{
					action: 'chat',
					to: this.id,
					text: chatText
				});
			}
			$('input[name=chat]').val('');
			return false;
		},

		render: function(){
			this.$el.html(this.template());
			return this;
		}
	});

	return BottomBarView;
});