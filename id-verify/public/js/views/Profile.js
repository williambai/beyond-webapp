define(['text!templates/profile.tpl'], function(profileTemplate){
	var ProfileView = Backbone.View.extend({
		el: '#content',
		template: _.template(profileTemplate),

		events: {
			'click .logout': 'logout'
		},

		initialize: function(options){
			this.appEvents = options.appEvents;
		},

		logout: function(){
			this.appEvents.trigger('logout');
			$.get('/logout');
			return false;
		},

		render: function(){
			this.$el.html(this.template());
			return this;
		}

	});
	return ProfileView;
});