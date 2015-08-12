define(['text!templates/profile.tpl','models/Account'], function(profileTemplate,Account){
	var ProfileView = Backbone.View.extend({
		el: '#content',
		template: _.template(profileTemplate),

		events: {
			'click .logout': 'logout'
		},

		initialize: function(options){
			this.appEvents = options.appEvents;
			this.model = new Account();
			this.model.url = '/accounts/me';
			this.on('load', this.load, this);
			this.model.on('change', this.render, this);
		},

		load: function(){
			this.model.fetch();
		},

		logout: function(){
			this.appEvents.trigger('logout');
			$.get('/logout');
			return false;
		},

		render: function(){
			this.$el.html(this.template({user: this.model.toJSON()}));
			return this;
		}

	});
	return ProfileView;
});