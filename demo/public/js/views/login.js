define(['text!templates/login.html'],function(loginTemplate){
	var LoginView = Backbone.View.extend({
		el: $('#content'),
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
				that.socketEvents.trigger('app:logined');
				window.location.hash = 'index';
			}).error(function(){
				$('#error').text('登录失败');
				$('#error').slideDown();
			});
			return false;
		},
		render: function(){
			this.$el.html(loginTemplate);
			return this;
		},

	});
	return LoginView;
});