var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');

var IndexView = require('./views/Index');
var LoginView = require('./views/Login');
var LayoutView = require('./views/Layout');
var UserIndexView = require('./views/UserIndex');
var UserEditView = require('./views/UserEdit');
var UserAppView = require('./views/UserApp');
var ProfileView = require('./views/Profile');
var Lottery3dView = require('./views/Lottery3d');
var OrderIndexView = require('./views/OrderIndex');
var OrderEditView = require('./views/OrderEdit');
var OrderImportView = require('./views/OrderImport');
var OrderDetailView = require('./views/OrderDetail');
var RecordIndexView = require('./views/RecordIndex');
var RecordEditView = require('./views/RecordEdit');
var RecordStatsView = require('./views/RecordStats');

Backbone.$ = $;

exports = module.exports = Backbone.Router.extend({
	account: null,
	logined: false,
	currentView : null,
	appEvents: _.extend({},Backbone.Events),

	routes: {
		'': 'index',
		'index': 'index',
		'login': 'login', 
		'register': 'register',
		'forgotpassword': 'forgotPassword',
		'forgotpassword/success': 'forgotPasswordSuccess',
		'profile': 'profile',
		'profile/me/edit': 'profileEdit',
		'user/index': 'userIndex',
		'user/edit/:id': 'userEdit',
		'user/app/:id': 'userApp',
		'user/add': 'userAdd', 
		'lottery/3d': 'lottery3d',
		'order/index': 'orderIndex',
		'order/add': 'orderAdd',
		'order/import': 'orderImport',
		'order/update/:id': 'orderUpdate',
		'order/detail/:id': 'orderDetail',
		'record/index': 'recordIndex',
		'record/update/:id': 'recordUpdate',
		'record/stats': 'recordStats',
	},

	changeView: function(view){
		if(null != this.currentView){
			this.currentView.undelegateEvents();
		}
		this.currentView = view;
		this.currentView.render();
	},
	
	initialize: function(){
		this.appEvents.on('logined',this.onLogined,this);
		this.appEvents.on('logout', this.onLogout,this);
		this.layoutView = new LayoutView({
			account: this.account,
			appEvents: this.appEvents,
		});
		this.layoutView.trigger('load');
	},

	onLogined: function(account){
		this.account = account;
		this.logined = true;
		this.layoutView.account = this.account;
		this.layoutView.trigger('load');
	},

	onLogout: function(){
		this.logined = false;
		this.account = null;
		this.layoutView.account = this.account;
		this.layoutView.trigger('load');
		window.location.hash = 'login';
	},

	index: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','主页');
		this.changeView(new IndexView());
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
			appEvents: this.appEvents
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
				appEvents: this.appEvents,
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

	userIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		if(this.account.roles.admin || this.account.roles.agent){
			this.appEvents.trigger('set:brand','用户管理');
			var userIndexView = new UserIndexView({account: this.account});
			this.changeView(userIndexView);
			userIndexView.trigger('load');
		}
	},

	userEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		if(this.account.roles.admin || this.account.roles.agent){
			this.appEvents.trigger('set:brand', '编辑用户');
			var userEditView = new UserEditView({id: id,account: this.account});
			this.changeView(userEditView);
			userEditView.trigger('load');
		}
	},

	userApp: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		if(this.account.roles.admin || this.account.roles.agent){
			this.appEvents.trigger('set:brand', '应用管理');
			var userAppView = new UserAppView({id: id,account: this.account});
			this.changeView(userAppView);
			userAppView.trigger('load');
		}
	},

	userAdd: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		if(this.account.roles.admin || this.account.roles.agent){
			this.appEvents.trigger('set:brand', '新增用户');
			var userEditView = new UserEditView({id: null, account: this.account});
			this.changeView(userEditView);
			userEditView.trigger('load');
		}
	},

	lottery3d: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		if(this.account.roles.user){
			this.appEvents.trigger('set:brand', '3D福彩');
			var lottery3dView = new Lottery3dView({account: this.account});
			this.changeView(lottery3dView);
			lottery3dView.trigger('load');
		}
	},

	orderIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		if(this.account.roles.user){
			this.appEvents.trigger('set:brand', '订单管理');
			var orderIndexView = new OrderIndexView({account: this.account});
			this.changeView(orderIndexView);
			orderIndexView.trigger('load');
		}
	},

	orderImport: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		if(this.account.roles.user){
			this.appEvents.trigger('set:brand', '导入订单');
			var orderImportView = new OrderImportView({account: this.account});
			this.changeView(orderImportView);
			orderImportView.trigger('load');
		}
	},

	orderAdd: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		if(this.account.roles.user){
			this.appEvents.trigger('set:brand', '新增订单');
			var orderEditView = new OrderEditView({account: this.account});
			this.changeView(orderEditView);
			orderEditView.trigger('load');
		}
	},

	orderUpdate: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		if(this.account.roles.user){
			this.appEvents.trigger('set:brand', '修改订单');
			var orderEditView = new OrderEditView({account: this.account,id: id});
			this.changeView(orderEditView);
			orderEditView.trigger('load');
		}
	},

	orderDetail: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		if(this.account.roles.user){
			this.appEvents.trigger('set:brand', '订单详情');
			var orderDetailView = new OrderDetailView({account: this.account,id: id});
			this.changeView(orderDetailView);
			orderDetailView.trigger('load');
		}
	},

	recordIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		if(this.account.roles.user || this.account.roles.app){
			this.appEvents.trigger('set:brand','出票记录');
			var recordIndexView = new RecordIndexView({account: this.account});
			this.changeView(recordIndexView);
			recordIndexView.trigger('load');
		}
	},

	recordUpdate: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		if(this.account.roles.user){
			this.appEvents.trigger('set:brand', '修改彩票');
			var recordEditView = new RecordEditView({account: this.account,id: id});
			this.changeView(recordEditView);
			recordEditView.trigger('load');
		}
	},

	recordStats: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		if(this.account.roles.user || this.account.roles.app){
			this.appEvents.trigger('set:brand','使用记录');
			var recordStatsView = new RecordStatsView({account: this.account});
			this.changeView(recordStatsView);
			recordStatsView.trigger('load');
		}
	},

});

