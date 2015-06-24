define(['text!templates/login_wechat.html'],function(loginTemplate){
	var LoginView = Backbone.View.extend({
		el: '#content',
		template: _.template(loginTemplate),

		events: {
			'submit form': 'login'
		},
		initialize: function(options){
			this.appEvents = options.appEvents;
		},
		login: function(){
			var that = this;
			$.post('/login',{
				email: $('input[name=email]').val(),
				password: $('input[name=password]').val()
			},function(data){
				that.appEvents.trigger('logined',data);
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