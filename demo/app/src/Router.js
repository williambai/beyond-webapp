var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');

var IndexView = require('./views/Index');
var ProjectListView = require('./views/_ListProject');
var ChatUserListView = require('./views/_ListChatUser');
var LayoutView = require('./views/__Layout');
var ProjectView = require('./views/Project');
var MyProjectView = require('./views/ProjectMy');
var NotificationView = require('./views/Notification');
var RegisterView = require('./views/Register');
var LoginView = require('./views/Login');
var ForgotPasswordView = require('./views/ForgotPassword');
var ResetPasswordView = require('./views/ResetPassword');
var ProfileView = require('./views/Profile');
var ProfileEditView = require('./views/ProfileEdit');
var FriendsView = require('./views/Friends');
var FriendAddView = require('./views/FriendAdd');
var FriendInviteView = require('./views/FriendInvite');
var ProjectIndexView = require('./views/ProjectIndex');
var ProjectAddView = require('./views/ProjectAdd');
var ProjectChatView = require('./views/ProjectChat');
var ProjectStatusView = require('./views/ProjectStatus');
var ProjectMembersView = require('./views/ProjectMembers');
var ProjectMemberAddView = require('./views/ProjectMemberAdd');
var ActivityView = require('./views/Activity');
var MessageView = require('./views/Message');
var SpaceView = require('./views/Space');
var ChatView = require('./views/Chat');
var config = require('./conf');

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
		'index': 'index',
		'projects': 'projects',
		'projects(/:type/(:searchStr))': 'projects',
		'project/me': 'projectMy',
		'activity/:id': 'activity',
		'message/:id': 'messageBox',
		'space/:id': 'space',
		'notify/me': 'notify',
		'chat/:id': 'chat',
		'login': 'login',
		'register': 'register',
		'forgotpassword': 'forgotPassword',
		'profile/:id': 'profile',
		'profile/me/edit': 'profileEdit',
		'friends': 'friends',
		'friend/add': 'addFriend',
		'friend/invite': 'inviteFriend',
		'project/add': 'addProject',
		'project/:pid/chat': 'projectChat',
		'project/:pid/index': 'projectIndex',
		'project/:pid/status': 'projectStatus',
		'project/:pid/member/add': 'projectMemberAdd',
		'project/:pid/members(/:cid)': 'projectMembers',
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
		var projectsView = new ProjectListView({
			socketEvents: this.socketEvents,
			url: config.api.host + '/projects/account/me'
		});
		projectsView.trigger('load');
		/* load friends */
		var friendsView = new ChatUserListView({
			socketEvents: this.socketEvents,
			url: config.api.host + '/friends/account'
		});
		friendsView.trigger('load');
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
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','首页');
		var indexView = new IndexView({
			socketEvents: this.socketEvents
		});
		this.changeView(indexView);
		indexView.trigger('load');
	},

	projects: function(type,searchStr){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','所有项目');
		var projectsView = new ProjectView({
			type: type,
			searchStr: searchStr,
			socketEvents: this.socketEvents
		});
		this.changeView(projectsView);
		projectsView.trigger('load');
	},

	projectMy: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','我的项目');
		var projectView = new MyProjectView({
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

	notify: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','通知');
		var notificationView = new NotificationView({
				account: this.account,
				socketEvents: this.socketEvents
			});
		this.changeView(notificationView);
		notificationView.trigger('load');
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
		var registerView = new RegisterView();
		this.changeView(registerView);
		registerView.trigger('load');
	},
	
	login: function(){
		if(this.logined){
			window.location.hash = 'index';
			return;
		}
		this.appEvents.trigger('set:brand','登录');
		var loginView = new LoginView({
			appEvents: this.appEvents,
			socketEvents: this.socketEvents,
		});
		this.changeView(loginView);
		loginView.trigger('load');
	},
	forgotPassword: function(){
		if(this.logined){
			window.location.hash = 'index';
			return;
		}
		this.appEvents.trigger('set:brand','找回密码');
		var forgotPassword = new ForgotPasswordView();
		this.changeView(forgotPassword);
		forgotPassword.trigger('load');
	},

	profile: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','个人资料');
		if(id == this.account.id){
			id = 'me';
		}
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

	friends: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','我的好友');
		var friendsView = new FriendsView();
		this.changeView(friendsView);
		friendsView.trigger('load');
	},
	addFriend: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','搜索和添加好友');
		this.changeView(new FriendAddView({account: this.account}));
	},

	inviteFriend: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','邀请好友');
		this.changeView(new FriendInviteView());
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
		projectAddView.trigger('load');
	},

	projectChat: function(pid){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','项目即时沟通');
		var chatView = new ProjectChatView({
				id: pid,
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
	
	projectMembers: function(pid,cid){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','项目成员');
		var projectMemberView = new ProjectMembersView({
				pid:pid,
				account: this.account
			});
		this.changeView(projectMemberView);
		projectMemberView.trigger('load');
	},

	projectMemberAdd: function(pid){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','新增项目成员');
		var projectMemberAddView = new ProjectMemberAddView({
				pid: pid,
				account: this.account
			});
		this.changeView(projectMemberAddView);
		projectMemberAddView.trigger('load');			
	},
});