var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');

var ProjectsView = require('./views/_ListProject');
var ChatUsersView = require('./views/_ListChatUser');
var LayoutView = require('./views/__Layout');
var ProjectView = require('./views/Project');
var RegisterView = require('./views/Register');
var LoginView = require('./views/Login');
var ForgotPasswordView = require('./views/ForgotPassword');
var ForgotPasswordSuccessView = require('./views/ForgotPasswordSuccess');
var ProfileView = require('./views/Profile');
var ProfileEditView = require('./views/ProfileEdit');
var ContactsView = require('./views/Contacts');
var ContactAddView = require('./views/ContactSearch');
var ContactInviteView = require('./views/ContactInvite');
var ProjectIndexView = require('./views/ProjectIndex');
var ProjectAddView = require('./views/ProjectAdd');
var ProjectChatView = require('./views/ProjectChat');
var ProjectStatusView = require('./views/ProjectStatus');
var ProjectContactsView = require('./views/ProjectContacts');
var ProjectContactAddView = require('./views/ProjectContactSearch');
var ActivityView = require('./views/Activity');
var MessageView = require('./views/Message');
var SpaceView = require('./views/Space');
var ChatView = require('./views/Chat');

Backbone.$ = $;

exports = module.exports = Backbone.Router.extend({

	account: null,//login account
	logined: false,
	currentView : null,
	// socket: null,
	appEvents: _.extend({},Backbone.Events),//app events
	socketEvents: _.extend({},Backbone.Events),//socket events ---Deprecated!
	routes: {
		'': 'index',
		'project/me': 'project',
		'activity/:id': 'activity',
		'message/:id': 'messageBox',
		'status/:id': 'space',
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
		var layoutView = new LayoutView({
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
		/* load projects */
		var projectsView = new ProjectsView({
			socketEvents: this.socketEvents,
			url: '/projects/account/me'
		});
		projectsView.trigger('load');
		/* load contacts */
		var contactsView = new ChatUsersView({
			socketEvents: this.socketEvents,
			url: '/friends/account/me'
		});
		contactsView.trigger('load');
	},

	onLogout: function(){
		this.logined = false;
		window.location.reload();
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
		window.location.hash = 'activity/me';
	},

	project: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','我的项目');
		var projectView = new ProjectView({
			socketEvents: this.socketEvents
		});
		this.changeView(projectView);
		projectView.trigger('load');
	},

	activity: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','同事圈');
		var statusesView = new ActivityView({
				id:id,
				account: this.account,
				socketEvents: this.socketEvents
			});
		this.changeView(statusesView);
		statusesView.trigger('load');
	},

	messageBox: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','私信');
		var statusesView = new MessageView({
				id:id,
				account: this.account,
				socketEvents: this.socketEvents
			});
		this.changeView(statusesView);
		statusesView.trigger('load');
	},

	space: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','个人空间');
		var statusesView = new SpaceView({
				id:id,
				account: this.account,
				socketEvents: this.socketEvents
			});
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
		this.changeView(new ContactAddView({account: this.account}));
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
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','一对一聊天');
		var chatView = new ChatView({
				id: id,
				account: this.account,
				socketEvents: this.socketEvents
			});
		this.changeView(chatView);
		chatView.trigger('load');
	},

	projectIndex: function(pid){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','项目概况');
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
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','项目即时沟通');
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
		this.appEvents.trigger('set:brand','项目消息');
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
		this.appEvents.trigger('set:brand','项目成员');
		var contactId = cid ? cid: 'me';
		var projectContactView = new ProjectContactsView({
				pid:pid,
				account: this.account
			});
		this.changeView(projectContactView);
		projectContactView.trigger('load');
	},

	projectContactAdd: function(pid){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','新增项目成员');
		var projectContactAddView = new ProjectContactAddView({
				pid: pid,
				account: this.account
			});
		this.changeView(projectContactAddView);			
	},
});