define(['views/index','views/register','views/login','views/forgotPassword'],
	function(indexView,RegisterView,LoginView,ForgotPasswordView){

	var SocailRouter = Backbone.Router.extend({
		currentView : null,
		routes: {
			'index': 'index',
			'login': 'login',
			'register': 'register',
			'forgotpassword': 'forgotPassword',
		},
		changeView: function(view){
			if(null != this.currentView){
				this.currentView.undelegateEvents();
			}
			this.currentView = view;
			this.currentView.render();
		},
		index: function(){
			this.changeView(indexView);
		},
		register: function(){
			this.changeView(new RegisterView());
		},
		login: function(){
			this.changeView(new LoginView());
		},
		forgotPassword: function(){
			this.changeView(new ForgotPasswordView());
		}
	});

	return new SocailRouter();
});