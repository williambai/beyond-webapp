define(['views/Layout','views/Index','views/Register','views/Login','views/ForgotPassword','views/ForgotPasswordSuccess','views/Profile','views/ProfileEdit','views/Contacts','views/ContactAdd','views/ContactInvite','views/ChatUsers','views/ProjectIndex','views/ProjectAdd','views/ProjectChat','views/Projects','views/ProjectStatus','views/ProjectContacts','views/ProjectContactSearch','views/Statuses','views/Chat'], function(LayoutView,IndexView,RegisterView,LoginView,ForgotPasswordView,ForgotPasswordSuccessView,ProfileView,ProfileEditView,ContactsView,ContactAddView,ContactInviteView,ChatUsersView,ProjectIndexView,ProjectAddView,ProjectChatView,ProjectsView,ProjectStatusView,ProjectContactsView,ProjectContactAddView,StatusesView,ChatView){

	var SocailRouter = Backbone.Router.extend({
		account: null,//login account
		logined: false,
		currentView : null,
		appEvents: _.extend({},Backbone.Events),//app inner events
		socketEvents: _.extend({},Backbone.Events),//socket events
		// currentChatView: null,
		// chatSessions: {},
		routes: {
			'': 'index',
			'index': 'index',
			'activity/:id': 'activity',
			'message/:id': 'messageBox',
			'status/:id': 'status',
			'chat/:id': 'chat',
			'login': 'login',
			'register': 'register',
			'forgotpassword': 'forgotPassword',
			'forgotpassword/success': 'forgotPasswordSuccess',
			'profile/:id': 'profile',
			'profile/me/edit': 'profileEdit',
			'contacts/:id': 'contacts',
			'contact/add': 'addContact',
			'contact/invite': 'inviteContact',
			'project/add': 'addProject',
			'project/chat/:id': 'projectChat',
			'projects/:pid/index': 'projectIndex',
			'projects/:pid/status': 'projectStatus',
			'projects/:pid/contact/add': 'projectContactAdd',
			'projects/:pid/contacts(/:cid)': 'projectContacts',
		},
		initialize: function(){
			this.appEvents.on('logined',this.onLogined,this);
			this.appEvents.on('logout', this.onLogout,this);
			layoutView = new LayoutView({
				appEvents: this.appEvents,
				socketEvents: this.socketEvents,
			});
			layoutView.trigger('load');
		},

		onLogined: function(account){
			// console.log('++')
			// console.log(account);
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
			$('body').removeClass('has-navbar-bottom');
			$('.bottom-bar').remove();
			this.currentView.render();
		},

		index: function(){
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
			this.appEvents.trigger('set:brand','主页');
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
			this.appEvents.trigger('set:brand','朋友圈');
			var statusesView = new StatusesView({id:id,statusType:'activity',socketEvents: this.socketEvents});
			this.changeView(statusesView);
			statusesView.trigger('load');
		},

		messageBox: function(id){
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
			this.appEvents.trigger('set:brand','私信');
			var statusesView = new StatusesView({id:id,statusType:'message',socketEvents: this.socketEvents});
			this.changeView(statusesView);
			statusesView.trigger('load');
		},

		status: function(id){
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
			this.appEvents.trigger('set:brand','私人空间');
			var statusesView = new StatusesView({id:id,statusType:'status',socketEvents: this.socketEvents});
			this.changeView(statusesView);
			statusesView.trigger('load');
		},

		register: function(){
			if(this.logined){
				window.location.hash = 'index';
				return;
			}
			this.appEvents.trigger('set:brand','注册');
			this.changeView(new RegisterView());
		},
		login: function(){
			if(this.logined){
				window.location.hash = 'index';
				return;
			}
			this.appEvents.trigger('set:brand','登录');
			this.changeView(new LoginView({
				appEvents: this.appEvents,
				socketEvents: this.socketEvents,
			}));
		},
		forgotPassword: function(){
			if(this.logined){
				window.location.hash = 'index';
				return;
			}
			this.appEvents.trigger('set:brand','找回密码');
			this.changeView(new ForgotPasswordView());
		},
		forgotPasswordSuccess: function(){
			if(this.logined){
				window.location.hash = 'index';
				return;
			}
			this.appEvents.trigger('set:brand','找回密码');
			this.changeView(new ForgotPasswordSuccessView());
		},
		profile: function(id){
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
			this.appEvents.trigger('set:brand','个人资料');
			var profileView = new ProfileView({
					id:id,
					appEvents: this.appEvents,
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
			this.appEvents.trigger('set:brand','编辑个人资料');
			var profileEditView = new ProfileEditView();
			this.changeView(profileEditView);
			profileEditView.trigger('load');
		},

		contacts: function(id){
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
			this.appEvents.trigger('set:brand','我的好友');
			var contactsView = new ContactsView({id:id});
			this.changeView(contactsView);
			contactsView.trigger('load');
		},
		addContact: function(){
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
			this.appEvents.trigger('set:brand','搜索和添加好友');
			this.changeView(new ContactAddView());
		},

		inviteContact: function(){
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
			this.appEvents.trigger('set:brand','邀请好友');
			this.changeView(new ContactInviteView());
		},
		
		chat: function(id){
			// if(null != this.currentChatView){
			// 	this.currentChatView.undelegateEvents();
			// }
			// if(!this.chatSessions[id]){
				var chatView = new ChatView({
						id: id,
						account: this.account,
						socketEvents: this.socketEvents
					});
				this.changeView(chatView);
				chatView.trigger('load');
			// this.chatSessions[id] = chatView;
			// }else{
			// 	var view = this.chatSessions[id];
			// 	view.delegateEvents();
			// 	view.render();
			// 	var collection = view.collection;
			// 	collection.trigger('reset',collection);
			// }

			// this.currentChatView = this.chatSessions[id];
		},

		projectIndex: function(pid){
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
			var projectView = new ProjectIndexView({
				pid: pid,
				account: this.account,
			});
			this.changeView(projectView);
			projectView.trigger('load');
		},

		addProject: function(){
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
			this.appEvents.trigger('set:brand','新建项目');
			var projectAddView = new ProjectAddView({
					socketEvents: this.socketEvents
				});
			this.changeView(projectAddView);
		},

		projectChat: function(id){
			var chatView = new ProjectChatView({
					id: id,
					account: this.account,
					socketEvents: this.socketEvents
				});
			this.changeView(chatView);
			chatView.trigger('load');
		},

		projectStatus: function(pid){
			if(!this.logined){
				window.location.hash = 'login';
				return;
			}
			// var project = this.projectCollection.find({_id:id});
			// this.appEvents.trigger('set:brand','项目：' + id);
			var projectView = new ProjectStatusView({
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
					account: this.account,
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