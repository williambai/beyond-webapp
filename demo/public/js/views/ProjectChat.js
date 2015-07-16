define(['text!templates/modal.html','text!templates/chat.html','views/ProjectBottomBar','views/ScrollableView','views/ChatItem','models/Project','models/Status','models/StatusCollection'], function(modalTemplate,projectChatTemplate,BottomBarView,ScrollableView,ChatItemView,Project,Status,StatusCollection){
	var ProjectChatView = ScrollableView.extend({
		el: '#content',

		template: _.template(projectChatTemplate),

		events: {
			'click .chat-content img': 'showInModal',
			'scroll': 'scrollUp',
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
			this.model = new Project();
			this.model.url = '/projects/' + options.id;
			this.model.on('change', this.render,this);
			this.collection = new StatusCollection();
			this.collection.url = '/projects/' + this.id + '/status';
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
			var that = this;
			this.model.fetch({
				success: function(model){
					if(that.account.id == model.get('accountId')){
						model.set('isOwner', true);
					}
					that.collection.fetch({reset:true});
				}
			});
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
			this.$el.animate({scrollTop: this.$el.get(0).scrollHeight},1);
		},

		render: function(){
			//增加 bottom Bar
			if(this.model.get('_id') && $('.navbar-absolute-bottom').length == 0){
				var bottomBarView = new BottomBarView({
						id: this.id,
						project: this.model,
						account: this.account,
						socketEvents: this.socketEvents,
						parentView: this,
					});
				$(bottomBarView.render().el).prependTo('.app');
				if(!$('body').hasClass('has-navbar-bottom')){
					$('body').addClass('has-navbar-bottom');
				}
			}
			this.$el.html(this.template({project: this.model.toJSON()}));
			return this;
		}

	});
	return ProjectChatView;
});