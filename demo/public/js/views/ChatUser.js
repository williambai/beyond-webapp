define(['text!templates/chatuser.html'],function(ChatUserTemplate){
	var ChatUserView = Backbone.View.extend({
		tagName: 'div',
		template: _.template(ChatUserTemplate),

		events: {
			'click': 'startChatSession'
		},

		initialize: function(options){
			var accountId = this.model.get('accountId');
			options.socketEvents.bind(
					'login:'+ accountId,
					this.handleContactLogin,
					this
				);
			options.socketEvents.bind(
					'logout:' + accountId,
					this.handleContactLogout,
					this				
				);
			options.socketEvents.bind(
					'socket:chat:start:' + this.model.get('accountId'),
					this.startChatSession,
					this
				);
		},

		handleContactLogin: function(eventObj){
			this.model.set('online', true);
			this.$el.find('.label').addClass('label-success').html('<i>在线</i>');
		},

		handleContactLogout: function(eventObj){
			this.model.set('online', false);
			this.$el.find('.label').removeClass('label-success').html('<i>离线</i>');
		},

		startChatSession: function(){
			window.location.hash = 'chat/' + this.model.get('accountId');
			return false;
			// this.trigger('chat:start', this.model);
		},

		render: function(){
			this.$el.html(this.template({model: this.model.toJSON()}));
			if(this.model.get('online')){
				this.handleContactLogin();
			}

			return this;
		}
	});
	return ChatUserView;
});