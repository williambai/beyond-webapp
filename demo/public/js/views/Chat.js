define(['text!templates/modal.html','text!templates/chat.html','views/_FormChat','views/__ScrollableView','views/_ItemChat','models/Chat','models/ChatCollection'], function(modalTemplate, chatSessionTemplate,BottomBarView,ScrollableView,ChatItemView,Chat,ChatCollection){
	var ChatView = ScrollableView.extend({
		template: _.template(chatSessionTemplate),
		el: '#content',

		events: {
			'click .chat-content img': 'showInModal',
			'scroll': 'scrollUp',
		},

		initialize: function(options){
			this.id = options.id;
			this.account = options.account;
			this.socketEvents = options.socketEvents;
			this.socketEvents.off('socket:in:chat');
			this.socketEvents.on(
					'socket:in:chat',
					this.socketReceiveChat, 
					this
				);
			this.collection = new ChatCollection();
			this.collection.url = '/chats/' + this.id;
			this.collectionUrl = this.collection.url;
			this.listenTo(this.collection, 'reset', this.onChatCollectionReset);
			this.on('load', this.load, this);
		},

		showInModal: function(evt){
			var targetType = $(evt.currentTarget).attr('target-type');			
			var targetData = $(evt.currentTarget).attr('target-data');
			if(targetType != 'image' && targetType != 'video'){
				window.open(targetData,'_blank');
				return false;
			}
			if(targetType == 'image'){
			    // Create a modal view class
		    	var Modal = Backbone.Modal.extend({
		    	  template: (_.template(modalTemplate))(),
		    	  cancelEl: '.bbm-button'
		    	});
				// Render an instance of your modal
				var modalView = new Modal();
				$('body').append(modalView.render().el);
				$('.bbm-modal__section').html('<img src="' + targetData +'">');
			}
			return false;
		},

		load: function(){
			this.render();
			this.collection.fetch({reset:true});
		},


		socketReceiveChat: function(data){
			if(data){
				var from = data.from;
				var to = data.to;
				var content = data.content;
				if(from.id == this.id){
					var chat = new Chat({
						fromId: from.id,
						toId: to.id,
						username: from.username,
						avatar: from.avatar,
						status: content,
					});
					chat.set('from', 'others');
					this.collection.add(chat);
					this.onChatAdded(chat);
				}	
			}
		},

		onChatAdded: function(chat){
			var fromId = chat.get('fromId');
			if(fromId != this.id) {
				chat.set('from','me');
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
					chat.set('from','me');
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