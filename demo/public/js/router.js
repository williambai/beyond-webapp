define(['views/Index','views/Register','views/Login','views/ForgotPassword','views/Profile','views/Contacts','views/AddContact','views/ChatUsers','views/AddProject','views/Projects','models/Account','models/Project','models/StatusCollection','models/ContactCollection','models/ProjectCollection'], function(IndexView,RegisterView,LoginView,ForgotPasswordView,ProfileView,ContactsView,AddContactView,ChatUsersView,AddProjectView,ProjectsView,Account,Project,StatusCollection,ContactCollection,ProjectCollection){

	var SocailRouter = Backbone.Router.extend({
		currentView : null,
		sidebarView : null,
		currentChatView: null,
		chatSessions: {},
		projectCollection: null,
		socketEvents: _.extend({},Backbone.Events),
		routes: {
			'index': 'index',
			'login': 'login',
			'register': 'register',
			'forgotpassword': 'forgotPassword',
			'profile/:id': 'profile',
			'contacts/:id': 'contacts',
			'addcontact': 'addContact',
			'project/add': 'addProject',
		},
		initialize: function(){
			this.projectCollection = new ProjectCollection();
			this.projectCollection.url = '/projects';
			this.sidebarView = new ProjectsView({
				collection: this.projectCollection,
				socketEvents: this.socketEvents,
				chatSessions: this.chatSessions,
				currentChatView: this.currentChatView
			});
			this.projectCollection.fetch({reset:true});
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
			this.changeView(new IndexView({collection: statusCollection,socketEvents: this.socketEvents}));
			statusCollection.fetch();
		},

		register: function(){
			this.changeView(new RegisterView());
		},
		login: function(){
			this.changeView(new LoginView({socketEvents: this.socketEvents}));
		},
		forgotPassword: function(){
			this.changeView(new ForgotPasswordView());
		},
		profile: function(id){
			var account = new Account({id: id});
			this.changeView(new ProfileView({model: account,socketEvents: this.socketEvents}));
			account.fetch();
		},
		contacts: function(id){
			var contactId = id ? id: 'me';
			var contactCollection = new ContactCollection();
			contactCollection.url = '/accounts/' + contactId + '/contacts';
			this.changeView(new ContactsView({collection: contactCollection}));
			contactCollection.fetch();
		},
		addContact: function(){
			this.changeView(new AddContactView());
		},

		addProject: function(){
			this.changeView(new AddProjectView({projectCollection: this.projectCollection}));
		},
	});

	return new SocailRouter();
});