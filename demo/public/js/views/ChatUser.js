define(['text!templates/chatuser.html'],function(ChatUserTemplate){
	var ChatUserView = Backbone.View.extend({
		tagName: 'li',
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
			this.$el.find('.online_indicator').addClass('online');
		},

		handleContactLogout: function(eventObj){
			this.model.set('online', false);
			this.$el.find('.online_indicator').removeClass('online');
		},

		startChatSession: function(){
			this.trigger('chat:start', this.model);
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