define(['views/Layout','views/Index','views/Register','views/Login','views/ForgotPassword','views/Profile','views/Contacts','views/AddContact','views/ChatUsers','views/AddProject','views/Projects','views/Project','views/ProjectContacts','views/ProjectContactSearch','models/Account','models/Project','models/StatusCollection','models/ContactCollection','models/ProjectCollection'], function(LayoutView,IndexView,RegisterView,LoginView,ForgotPasswordView,ProfileView,ContactsView,AddContactView,ChatUsersView,AddProjectView,ProjectsView,ProjectView,ProjectContactsView,ProjectContactAddView,Account,Project,StatusCollection,ContactCollection,ProjectCollection){

	var SocailRouter = Backbone.Router.extend({
		logined: false,
		layoutView: null,
		currentView : null,
		sidebarView : null,
		currentChatView: null,
		chatSessions: {},
		projectCollection: null,
		socketEvents: _.extend({},Backbone.Events),
		routes: {
			'index': 'index',
			'status': 'index',
			'login': 'login',
			'register': 'register',
			'forgotpassword': 'forgotPassword',
			'profile/:id': 'profile',
			'contacts/:id': 'contacts',
			'addcontact': 'addContact',
			'project/add': 'addProject',
			'projects/:id': 'projectIndex',
			'projects/:pid/contact/add': 'projectContactAdd',
			'projects/:pid/contacts(/:cid)': 'projectContacts',
		},
		initialize: function(){
			this.layoutView = new LayoutView();
			this.layoutView.render();

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
			this.layoutView.trigger('set:brand','注册');
			var statusCollection = new StatusCollection();
			statusCollection.url = '/accounts/me/status';
			this.changeView(new IndexView({collection: statusCollection,socketEvents: this.socketEvents}));
			statusCollection.fetch({error: function(){
				console.log(error);
				window.location.hash= 'login';
			}});
		},

		register: function(){
			this.layoutView.trigger('set:brand','注册');
			this.changeView(new RegisterView());
		},
		login: function(){
			this.layoutView.trigger('set:brand','登录');
			this.changeView(new LoginView({
				socketEvents: this.socketEvents,
				router: this,
			}));
		},
		forgotPassword: function(){
			this.changeView(new ForgotPasswordView());
		},
		profile: function(id){
			this.layoutView.trigger('set:brand','个人资料');
			var account = new Account({id: id});
			this.changeView(new ProfileView({model: account,socketEvents: this.socketEvents}));
			account.fetch({error: function(){
				window.location.hash= 'login';
			}});
		},
		contacts: function(id){
			var contactId = id ? id: 'me';
			var contactCollection = new ContactCollection();
			contactCollection.url = '/accounts/' + contactId + '/contacts';
			this.changeView(new ContactsView({collection: contactCollection}));
			contactCollection.fetch({error: function(){
				window.location.hash= 'login';
			}});
		},
		addContact: function(){
			if(this.logined){
				this.changeView(new AddContactView());
			}else{
				window.location.hash = 'login';
			}
		},

		addProject: function(){
			if(this.logined){
				this.changeView(new AddProjectView({projectCollection: this.projectCollection}));
			}else{
				window.location.hash = 'login';
			}
		},

		projectIndex: function(id){
			// var project = this.projectCollection.find({_id:id});
			// this.layoutView.trigger('set:brand','项目：' + id);
			var statusCollection = new StatusCollection();
			statusCollection.url = '/projects/'+ id +'/status';
			this.changeView(new ProjectView({
				pid: id,
				collection: statusCollection,
				socketEvents: this.socketEvents
			}));
			statusCollection.fetch({error: function(){
				window.location.hash= 'login';
			}});
		},
		projectContacts: function(pid,cid){
			var contactId = cid ? cid: 'me';
			var contactCollection = new ContactCollection();
			contactCollection.url = '/projects/' + pid + '/contacts';
			this.changeView(new ProjectContactsView({pid:pid,collection: contactCollection}));
			contactCollection.fetch({error: function(){
				window.location.hash= 'login';
			}});
		},
		projectContactAdd: function(pid){
			if(this.logined){
				this.changeView(new ProjectContactAddView({pid: pid}));
			}else{
				window.location.hash = 'login';
			}
		},
	});

	return new SocailRouter();
});