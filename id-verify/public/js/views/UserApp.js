define(['text!templates/userApp.tpl','models/Account'], function(userAppTemplate,Account){
	var UserAppView = Backbone.View.extend({
		el: '#content',
		template: _.template(userAppTemplate),

		events: {
			'submit form': 'submit',
			'click .regenerate': 'regenerate',
		},

		initialize: function(options){
			this.id = options.id;
			this.account = options.account;
			this.model = new Account();
			this.on('load', this.load,this);
			this.model.on('change', this.render,this);
		},

		load: function(){
			this.model.url = '/accounts/' + this.id;
			this.model.fetch();
			this.render();
		},

		render: function(){
			this.$el.html(this.template({user: this.model.toJSON()}));
			return this;
		}

	});

	return UserAppView;
})