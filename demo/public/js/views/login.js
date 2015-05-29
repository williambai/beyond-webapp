define(['text!templates/_layout.html','text!templates/login.html'],function(layoutTemplate,loginTemplate){
	var LoginView = Backbone.View.extend({
		el: $('#content'),

		layout: _.template(layoutTemplate),
		template: _.template(loginTemplate),

		events: {
			'submit form': 'login'
		},
		initialize: function(options){
			this.socketEvents = options.socketEvents;
		},
		login: function(){
			var that = this;
			$.post('/login',{
				email: $('input[name=email]').val(),
				password: $('input[name=password]').val()
			},function(data){
				console.log(data);
				that.socketEvents.trigger('app:logined',data);
				window.location.hash = 'index';
			}).error(function(){
				$('#error').text('登录失败');
				$('#error').slideDown();
			});
			return false;
		},
		render: function(){
			this.$el.html(this.layout({brand: '登录'}));
			this.$el.find('#main').html(loginTemplate);
			return this;
		},

	});
	return LoginView;
});