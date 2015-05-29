define(['text!templates/projectItem.html'],function(projectItemTemplate){
	var ProjectItemView = Backbone.View.extend({
		tagName: 'div',
		template: _.template(projectItemTemplate),

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
			this.$el.html(this.template(this.model.toJSON()));
			if(this.model.get('online')){
				this.handleContactLogin();
			}

			return this;
		}
	});
	return ProjectItemView;
});