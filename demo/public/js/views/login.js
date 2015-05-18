define(['text!templates/login.html'],function(loginTemplate){
	var LoginView = Backbone.View.extend({
		el: $('#content'),
		events: {
			'submit form': 'login'
		},
		login: function(){
			$.post('/login',{
				email: $('input[name=email]').val(),
				password: $('input[name=password]').val()
			},function(data){
				console.log(data);
			}).error(function(){
				$('#error').text('登录失败');
				$('#error').slideDown();
			});
			return false;
		},
		render: function(){
			this.$el.html(loginTemplate);
		},

	});
	return LoginView;
});