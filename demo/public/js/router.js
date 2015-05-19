define(['views/Index','views/Register','views/Login','views/ForgotPassword','views/Profile','models/Account','models/StatusCollection'],
	function(IndexView,RegisterView,LoginView,ForgotPasswordView,ProfileView,Account,StatusCollection){

	var SocailRouter = Backbone.Router.extend({
		currentView : null,
		routes: {
			'index': 'index',
			'login': 'login',
			'register': 'register',
			'forgotpassword': 'forgotPassword',
			'profile/:id': 'profile'
		},
		changeView: function(view){
			if(null != this.currentView){
				this.currentView.undelegateEvents();
			}
			this.currentView = view;
			this.currentView.render();
		},
		index: function(){
			var statusCollection = new StatusCollection();
			statusCollection.url = '/accounts/me/activity';
			this.changeView(new IndexView({collection: statusCollection}));
			statusCollection.fetch();
		},
		register: function(){
			this.changeView(new RegisterView());
		},
		login: function(){
			this.changeView(new LoginView());
		},
		forgotPassword: function(){
			this.changeView(new ForgotPasswordView());
		},
		profile: function(id){
			var account = new Account({id: id});
			this.changeView(new ProfileView({model: account}));
			account.fetch();
		}
	});

	return new SocailRouter();
});