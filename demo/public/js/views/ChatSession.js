define(['text!templates/chatsession.html'], function(chatSessionTemplate){
	var ChatSessionView = Backbone.View.extend({
		template: _.template(chatSessionTemplate),
		el: $('#content'),
		// tagName: 'div',
		className: 'chat_session',

		events: {
			'submit form': 'sendChat'
		},

		initialize: function(options){
			this.socketEvents = options.socketEvents;
			this.socketEvents.on(
					'socket:chat:in:' + this.model.get('accountId'),
					this.receiveChat, 
					this
				);
		},
		sendChat: function(){
			var chatText = $('input[name=chat]').val();
			if(chatText && /[^\s]+/.test(chatText)){
				var chatLine = '我：' + chatText;
				this.$el.find('.chat_log').append('<li>' + chatLine + '</li>');
				this.socketEvents.trigger('socket:chat',{
					to: this.model.get('accountId'),
					text: chatText
				});
			}
			return false;
		},

		receiveChat: function(data){
			var chatLine = this.model.get('name').first + ': ' + data.text;
			this.$el.find('.chat_log').append('<li>' + chatLine + '</li>');
		},

		render: function(){
			this.$el.html(this.template({model: this.model.toJSON()}));
			return this;
		}
	});
	return ChatSessionView;
});