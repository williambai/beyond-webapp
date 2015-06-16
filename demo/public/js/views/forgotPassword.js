define(['text!templates/forgotPassword.html'],function(forgotPasswordTemplate){
	var ForgotPasswordView = Backbone.View.extend({
		el: '#content',

		events: {
			'submit form': 'forgotPassword'
		},
		forgotPassword: function(){
			$.post('/forgotPassword',{
				email: $('input[name=email]').val()
			},function(data){
				window.location.hash = 'forgotpassword/success';
			});
			return false;
		},
		render: function(){
			this.$el.html(forgotPasswordTemplate);
			return this;
		}
	});

	return ForgotPasswordView; 
});