define(['text!templates/imageModal.html','text!templates/chat.html','views/ChatBottomBar','views/ScrollableView','views/ChatItem','models/Chat','models/ChatCollection'], function(imageModalTemplate, chatSessionTemplate,BottomBarView,ScrollableView,ChatItemView,Chat,ChatCollection){
	var ChatView = ScrollableView.extend({
		template: _.template(chatSessionTemplate),
		el: '#content',

		events: {
			'click .chat-content img': 'showImageInModal',
			'scroll': 'scrollUp',
		},

		initialize: function(options){
			this.id = options.id;
			this.account = options.account;
			this.socketEvents = options.socketEvents;
			this.socketEvents.on(
					'socket:chat:in:' + this.id,
					this.socketReceiveChat, 
					this
				);
			this.collection = new ChatCollection();
			this.collection.url = '/chats/' + this.id;
			this.collectionUrl = this.collection.url;
			this.listenTo(this.collection, 'reset', this.onChatCollectionReset);
			this.on('load', this.load, this);
		},

		showImageInModal: function(evt){
			var imageUrl = $(evt.currentTarget).attr('src');
		    // Create a modal view class
		    var Modal = Backbone.Modal.extend({
		      template: (_.template(imageModalTemplate))({src: imageUrl}),
		      cancelEl: '.bbm-button'
		    });
			// // Render an instance of your modal
			var modalView = new Modal();
			$('body').append(modalView.render().el);
			return false;
		},
		load: function(){
			this.render();
			this.collection.fetch({reset:true});
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
			this.$el.animate({scrollTop: this.$el.get(0).scrollHeight},1);
		},

		render: function(){
			//增加 bottom Bar
			if($('.navbar-absolute-bottom').length == 0){
				var bottomBarView = new BottomBarView({
						id: this.id,
						account: this.account,
						socketEvents: this.socketEvents,
						parentView: this,
					});
				$(bottomBarView.render().el).prependTo('.app');
				if(!$('body').hasClass('has-navbar-bottom')){
					$('body').addClass('has-navbar-bottom');
				}
			}
			this.$el.html(this.template());
			return this;
		}
	});
	return ChatView;
});