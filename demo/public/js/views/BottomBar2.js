define(['text!templates/bottomBar0.html','text!templates/bottomBar2.html'],function(bottomBar0Template,bottomBarTemplate){
	var BottomBarView = Backbone.View.extend({
		template0: _.template(bottomBar0Template),
		template: _.template(bottomBarTemplate),

		initialize: function(options){				
			this.id = options.id;
			this.account = options.account;
			this.socketEvents = options.socketEvents;
			this.parentView = options.parentView;
		},

		barToggle: true,
		
		events: {
			'submit form': 'sendChat',
			'click .chat-toggle': 'changeToolbar'
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

		changeToolbar: function(){
			// var toolbars = this.$('.navbar-absolute-bottom');
			// toolbars.each(function(index){
			// 	var toolbar = toolbars[index];
			// 	if($(toolbar).hasClass('hidden')){
			// 		$(toolbar).removeClass('hidden');
			// 	}else{
			// 		$(toolbar).addClass('hidden');				
			// 	}
			// });
			this.barToggle = !this.barToggle;
			if(this.barToggle){
				window.location.hash = 'project/chat/' + this.id;
			}
			this.render();
			return false;
		},

		render: function(){
			if(this.barToggle){
				this.$el.html(this.template());
			}else{
				this.$el.html(this.template0({id: this.id}));
			}
			return this;
		}
	});
	return BottomBarView;
});