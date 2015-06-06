define(['views/Layout','views/Index','views/Register','views/Login','views/ForgotPassword','views/Profile','views/ProfileEdit','views/Contacts','views/AddContact','views/ChatUsers','views/AddProject','views/Projects','views/Project','views/ProjectContacts','views/ProjectContactSearch','views/Statuses'], function(LayoutView,IndexView,RegisterView,LoginView,ForgotPasswordView,ProfileView,ProfileEditView,ContactsView,AddContactView,ChatUsersView,AddProjectView,ProjectsView,ProjectView,ProjectContactsView,ProjectContactAddView,StatusesView){

	var SocailRouter = Backbone.Router.extend({
		logined: false,
		layoutView: null,
		currentView : null,
		currentChatView: null,
		chatSessions: {},
		projectCollection: null,
		socketEvents: _.extend({},Backbone.Events),
		routes: {
			'index': 'index',
			'activity/:id': 'activity',
			'status/:id': 'status',
			'login': 'login',
			'register': 'register',
			'forgotpassword': 'forgotPassword',
			'profile/:id': 'profile',
			'profile/me/edit': 'profileEdit',
			'contacts/:id': 'contacts',
			'addcontact': 'addContact',
			'project/add': 'addProject',
			'projects/:id': 'projectIndex',
			'projects/:pid/contact/add': 'projectContactAdd',
			'projects/:pid/contacts(/:cid)': 'projectContacts',
		},
		initialize: function(){
			this.layoutView = new LayoutView({
				socketEvents: this.socketEvents,
				chatSessions: this.chatSessions,
				currentChatView: this.currentChatView				
			});
			this.layoutView.trigger('load');
			this.projectCollection = this.layoutView.projectCollection;
		},

		changeView: function(view){
			if(null != this.currentView){
				this.currentView.undelegateEvents();
			}
			this.currentView = view;
			this.currentView.render();
		},

		index: function(){
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
			this.layoutView.trigger('set:brand','主页');
			var indexView = new IndexView({
				socketEvents: this.socketEvents
			});
			this.changeView(indexView);
			indexView.trigger('load');
		},

		activity: function(id){
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
			this.layoutView.trigger('set:brand','朋友圈');
			var statusesView = new StatusesView({id:id,activity:true,socketEvents: this.socketEvents});
			this.changeView(statusesView);
			statusesView.trigger('load');
		},

		status: function(id){
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
			this.layoutView.trigger('set:brand','朋友圈');
			var statusesView = new StatusesView({id:id,socketEvents: this.socketEvents});
			this.changeView(statusesView);
			statusesView.trigger('load');
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
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
			this.layoutView.trigger('set:brand','个人资料');
			var profileView = new ProfileView({id:id,socketEvents: this.socketEvents});
			this.changeView(profileView);
			profileView.trigger('load');
		},

		profileEdit: function(){
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
			this.layoutView.trigger('set:brand','编辑个人资料');
			var profileEditView = new ProfileEditView();
			this.changeView(profileEditView);
			profileEditView.trigger('load');
		},

		contacts: function(id){
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
			this.layoutView.trigger('set:brand','我的好友');
			var contactsView = new ContactsView({id:id});
			this.changeView(contactsView);
			contactsView.trigger('load');
		},
		addContact: function(){
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
			this.changeView(new AddContactView());
		},

		addProject: function(){
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
			var projectAddView = new AddProjectView({
					projectCollection: this.projectCollection
				});
			this.changeView(projectAddView);
		},

		projectIndex: function(id){
			// var project = this.projectCollection.find({_id:id});
			// this.layoutView.trigger('set:brand','项目：' + id);
			var projectView = new ProjectView({
				pid: id,
				socketEvents: this.socketEvents
			});
			this.changeView(projectView);
			projectView.trigger('load');
		},
		
		projectContacts: function(pid,cid){
			var contactId = cid ? cid: 'me';
			var projectContactView = new ProjectContactsView({
					pid:pid,
				});
			this.changeView(projectContactView);
			projectContactView.trigger('load');
		},

		projectContactAdd: function(pid){
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
			var projectContactAddView = new ProjectContactAddView({
					pid: pid
				});
			this.changeView(projectContactAddView);			
		},
	});

	return new SocailRouter();
});