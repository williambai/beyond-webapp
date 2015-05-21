define(['text!templates/chatuser.html'],function(ChatUserTemplate){
	var ChatUserView = Backbone.View.extend({
		tagName: 'li',
		template: _.template(ChatUserTemplate),

		events: {
			'click': 'startChatSession'
		},

		initialize: function(options){
			options.socketEvents.bind(
					'socket:chat:start:' + this.model.get('accountId'),
					this.startChatSession,
					this
				);
		},

		startChatSession: function(){
			this.trigger('chat:start', this.model);
		},

		render: function(){
			this.$el.html(this.template({model: this.model.toJSON()}));
			return this;
		}
	});
	return ChatUserView;
});