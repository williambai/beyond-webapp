define(['text!templates/projectChat.html','views/ChatItem','models/Status','models/StatusCollection'], function(projectChatTemplate,ChatItemView,Status,StatusCollection){
	var ProjectChatView = Backbone.View.extend({
		el: '#content',

		template: _.template(projectChatTemplate),

		events: {
			'submit form': 'sendChat',
			'click .chat-toggle': 'changeToolbar'
		},
		initialize: function(options){
			this.id = options.id;
			this.account = options.account;
			this.socketEvents = options.socketEvents;
			this.socketEvents.on(
					'socket:project:chat:in:' + this.id,
					this.socketReceiveChat, 
					this
				);
			this.collection = new StatusCollection();
			this.collection.url = '/projects/' + this.id + '/status';
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
				// var statusObject = {
				// 	fromId: 'me',
				// 	toId: this.id,
				// 	username: this.account.id,
				// 	avatar: this.account.avatar,
				// 	status: chatText
				// };
				// var status = new Status(statusObject);
				// this.collection.add(status);
				// this.onChatAdded(status);

				this.socketEvents.trigger('socket:project:chat',{
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
			var data = socket.data;
			var userId = data.userId;
			var username = data.username;
			var avatar = data.avatar;
			var text = data.text;

			var status = new Status({
					fromId: userId,
					toId: fromId,
					username: username,
					avatar: avatar,
					status: text,
				});
			this.collection.add(status);
			this.onChatAdded(status);
		},

		onChatAdded: function(chat){
			var fromId = chat.get('fromId');
			if(fromId == this.account.id) {
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
				if(fromId == that.account.id) {
					chat.set('fromId','me');
				}
				var chatItemHtml = (new ChatItemView({model: chat})).render().el;
				$(chatItemHtml).prependTo('.chat_log').hide().fadeIn('fast');
			});
			this.$el.animate({scrollTop: this.$el.get(0).scrollHeight});
		},

		changeToolbar: function(){
			var toolbars = this.$('.navbar-absolute-bottom');
			toolbars.each(function(index){
				var toolbar = toolbars[index];
				if($(toolbar).hasClass('hidden')){
					$(toolbar).removeClass('hidden');
				}else{
					$(toolbar).addClass('hidden');				
				}
			});
			return false;
		},
		render: function(){
			this.$el.html(this.template({id: this.id}));
			return this;
		}

	});
	return ProjectChatView;
});