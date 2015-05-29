define(['text!templates/_layout.html','text!templates/forgotPassword.html'],function(layoutTemplate,forgotPasswordTemplate){
	var ForgotPasswordView = Backbone.View.extend({
		el: $('#content'),
		layout: _.template(layoutTemplate),

		events: {
			'submit form': 'forgotPassword'
		},
		forgotPassword: function(){
			$.post('/forgotPassword',{
				email: $('input[name=email]').val()
			},function(data){
				console.log(data);
			});
			return false;
		},
		render: function(){
			this.$el.html(this.layout({brand: '找回密码'}));
			this.$el.find('#main').html(forgotPasswordTemplate);
			return this;
		}
	});

	return ForgotPasswordView; 
});