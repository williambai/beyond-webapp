define(['views/Layout','views/Index','views/Register','views/Login','views/ForgotPassword','views/Profile','views/ProfileEdit','views/Contacts','views/ContactAdd','views/ChatUsers','views/ProjectAdd','views/ProjectChat','views/Projects','views/Project','views/ProjectContacts','views/ProjectContactSearch','views/Statuses','views/ChatSession'], function(LayoutView,IndexView,RegisterView,LoginView,ForgotPasswordView,ProfileView,ProfileEditView,ContactsView,ContactAddView,ChatUsersView,ProjectAddView,ProjectChatView,ProjectsView,ProjectView,ProjectContactsView,ProjectContactAddView,StatusesView,ChatSessionView){

	var SocailRouter = Backbone.Router.extend({
		account: null,//login account
		logined: false,
		layoutView: null,
		currentView : null,
		currentChatView: null,
		chatSessions: {},
		socketEvents: _.extend({},Backbone.Events),
		routes: {
			'index': 'index',
			'activity/:id': 'activity',
			'status/:id': 'status',
			'chat/:id': 'chat',
			'login': 'login',
			'register': 'register',
			'forgotpassword': 'forgotPassword',
			'profile/:id': 'profile',
			'profile/me/edit': 'profileEdit',
			'contacts/:id': 'contacts',
			'contact/add': 'addContact',
			'project/add': 'addProject',
			'project/chat/:id': 'projectChat',
			'projects/:pid/status': 'projectStatus',
			'projects/:pid/contact/add': 'projectContactAdd',
			'projects/:pid/contacts(/:cid)': 'projectContacts',
		},
		initialize: function(){
			this.on('logined',this.onLogined,this);
			this.on('logout', this.onLogout,this);
			this.layoutView = new LayoutView({
				socketEvents: this.socketEvents,
				chatSessions: this.chatSessions,
				currentChatView: this.currentChatView				
			});
			this.layoutView.trigger('load');
		},

		onLogined: function(account){
			// console.log('++')
			// console.log(account.avatar);
			this.account = account;
			this.logined = true;
		},

		onLogout: function(){
			this.logined = false;
			this.initialize();
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
			this.layoutView.trigger('set:brand','私人空间');
			var statusesView = new StatusesView({id:id,socketEvents: this.socketEvents});
			this.changeView(statusesView);
			statusesView.trigger('load');
		},

		register: function(){
			if(this.logined){
				window.location.hash = 'index';
				return;
			}
			this.layoutView.trigger('set:brand','注册');
			this.changeView(new RegisterView());
		},
		login: function(){
			if(this.logined){
				window.location.hash = 'index';
				return;
			}
			this.layoutView.trigger('set:brand','登录');
			this.changeView(new LoginView({
				socketEvents: this.socketEvents,
				router: this,
			}));
		},
		forgotPassword: function(){
			if(this.logined){
				window.location.hash = 'index';
				return;
			}
			this.changeView(new ForgotPasswordView());
		},
		profile: function(id){
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
			this.layoutView.trigger('set:brand','个人资料');
			var profileView = new ProfileView({
					id:id,
					router: this,
					socketEvents: this.socketEvents
				});
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
			this.layoutView.trigger('set:brand','搜索和添加好友');
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
			this.changeView(new ContactAddView());
		},
		
		chat: function(id){
			// if(null != this.currentChatView){
			// 	this.currentChatView.undelegateEvents();
			// }
			// if(!this.chatSessions[id]){
				var chatSessionView = new ChatSessionView({
						id: id,
						account: this.account,
						socketEvents: this.socketEvents
					});
				this.changeView(chatSessionView);
				chatSessionView.trigger('load');
			// this.chatSessions[id] = chatSessionView;
			// }else{
			// 	var view = this.chatSessions[id];
			// 	view.delegateEvents();
			// 	view.render();
			// 	var collection = view.collection;
			// 	collection.trigger('reset',collection);
			// }

			// this.currentChatView = this.chatSessions[id];
		},

		addProject: function(){
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
			this.layoutView.trigger('set:brand','新建项目');
			var projectAddView = new ProjectAddView({
					socketEvents: this.socketEvents
				});
			this.changeView(projectAddView);
		},

		projectChat: function(id){
			var chatSessionView = new ProjectChatView({
					id: id,
					account: this.account,
					socketEvents: this.socketEvents
				});
			this.changeView(chatSessionView);
			chatSessionView.trigger('load');
		},

		projectStatus: function(pid){
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
			// var project = this.projectCollection.find({_id:id});
			// this.layoutView.trigger('set:brand','项目：' + id);
			var projectView = new ProjectView({
				pid: pid,
				socketEvents: this.socketEvents
			});
			this.changeView(projectView);
			projectView.trigger('load');
		},
		
		projectContacts: function(pid,cid){
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
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