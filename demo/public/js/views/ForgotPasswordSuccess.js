define(['text!templates/forgotPasswordSuccess.html'],function(forgotPasswordSuccessTemplate){
	var ForgotPasswordView = Backbone.View.extend({
		el: '#content',
		template: _.template(forgotPasswordSuccessTemplate),

		render: function(){
			this.$el.html(this.template());
			return this;
		}
	});

	return ForgotPasswordView; 
});