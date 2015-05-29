define(['text!templates/_layout.html','text!templates/register.html'],function(layoutTemplate,registerTemplate){
	var RegisterView = Backbone.View.extend({
		el: $('#content'),
		layout: _.template(layoutTemplate),
		events: {
			'submit form': 'register',
		},
		register: function(){
			$.post('/register',{
				firstName: $('input[name=firstName]').val(),
				lastName: $('input[name=lastName]').val(),
				email: $('input[name=email').val(),
				password: $('input[name=password').val()
			}, function registerCallback(data){
				console.log(data);
			});
			return false;
		},
		render: function(){
			this.$el.html(this.layout({brand: '在线注册'}));
			this.$el.find('#main').html(registerTemplate);
			return this;
		},
	});

	return RegisterView;
});