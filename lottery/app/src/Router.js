var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');

var LayoutView = require('./views/Layout');
var IndexView = require('./views/Index');
var RegisterView = require('./views/Register');
var ForgotPasswordView = require('./views/ForgotPassword');
var ForgotPasswordSuccessView = require('./views/ForgotPasswordSuccess');
var LoginView = require('./views/Login');
var LoginNeedView = require('./views/LoginNeed');
var LoginNeedSuccessView = require('./views/LoginNeedSuccess');
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
	logined: 0,// 0: logout; 1: login-need something; 2 logined
	currentView : null,
	appEvents: _.extend({},Backbone.Events),

	routes: {
		'': 'index',
		'index': 'index',
		'login': 'login',
		'login/need': 'loginNeed', 
		'login/need/success': 'loginNeedSuccess',
		'register': 'register',
		'forgotpassword': 'forgotPassword',
		'forgotpassword/success': 'forgotPasswordSuccess',
		'profile': 'profile',
		'profile/me/edit': 'profileEdit',
		'user/index': 'userIndex',
		'user/edit/:id': 'userEdit',
		'user/app/:id': 'userApp',
		'user/add': 'userAdd', 
		'lottery/3d/:id': 'lottery3d',
		'order/index': 'orderIndex',
		'order/add': 'orderAdd',
		'order/import': 'orderImport',
		'order/update/:id': 'orderUpdate',
		'order/detail/:id': 'orderDetail',
		'record/index': 'recordIndex',
		'records/order/:id': 'orderRecords',
		'record/update/:id': 'recordUpdate',
		'record/stats': 'recordStats',
	},

	_needLogin: function(next){
		if(this.logined < 1){
			window.location.hash = 'login';
			return;
		}else if(this.logined < 2){
			window.location.hash = 'login/need';
			return;
		}
		next();
	},

	_needLogout: function(next){
		if(this.logined){
			window.location.hash = 'index';
			return;
		}
		next();
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
		this.logined = this.account.logined;
		this.layoutView.account = this.account;
		this.layoutView.trigger('load');
	},

	onLogout: function(){
		this.logined = 0;
		this.account = null;
		this.layoutView.account = this.account;
		this.layoutView.trigger('load');
		window.location.hash = 'login';
	},

	index: function(){
		var that = this;
		this._needLogin(function(){
			that.appEvents.trigger('set:brand','主页');
			that.changeView(new IndexView());
		});
	},

	register: function(){
		var that = this;
		this._needLogout(function(){
			that.appEvents.trigger('set:brand','注册');
			that.changeView(new RegisterView());
		});
	},

	loginNeed: function(){
		if(this.logined == 1){
			this.appEvents.trigger('set:brand','完善信息');
			this.changeView(new LoginNeedView());
			return;
		}
		window.location.hash = 'index';
	},

	loginNeedSuccess: function(){
		var that = this;
		this._needLogout(function(){
			that.appEvents.trigger('set:brand','个人信息完善成功');
			that.changeView(new LoginNeedSuccessView());
		});

	},

	login: function(){
		var that = this;
		this._needLogout(function(){
			that.appEvents.trigger('set:brand','登录');
			that.changeView(new LoginView({
				appEvents: that.appEvents
			}));
		});

	},

	forgotPassword: function(){
		var that = this;
		this._needLogout(function(){
			that.appEvents.trigger('set:brand','找回密码');
			that.changeView(new ForgotPasswordView());
		});

	},

	forgotPasswordSuccess: function(){
		var that = this;
		this._needLogout(function(){
			that.appEvents.trigger('set:brand','找回密码');
			that.changeView(new ForgotPasswordSuccessView());
		});

	},

	profile: function(id){
		var that = this;
		this._needLogin(function(){
			that.appEvents.trigger('set:brand','个人资料');
			var profileView = new ProfileView({
					appEvents: that.appEvents,
				});
			that.changeView(profileView);
			profileView.trigger('load');
		});

	},

	profileEdit: function(){
		var that = this;
		this._needLogin(function(){
			that.appEvents.trigger('set:brand','编辑个人资料');
			var profileEditView = new ProfileEditView();
			that.changeView(profileEditView);
			profileEditView.trigger('load');

		});
	},

	userIndex: function(){
		var that = this;
		this._needLogin(function(){
			if(that.account.roles.admin || that.account.roles.agent){
				that.appEvents.trigger('set:brand','用户管理');
				var userIndexView = new UserIndexView({account: that.account});
				that.changeView(userIndexView);
				userIndexView.trigger('load');
			}

		});
	},

	userEdit: function(id){
		var that = this;
		this._needLogin(function(){
			if(that.account.roles.admin || that.account.roles.agent){
				that.appEvents.trigger('set:brand', '编辑用户');
				var userEditView = new UserEditView({id: id,account: that.account});
				that.changeView(userEditView);
				userEditView.trigger('load');
			}
		});

	},

	userApp: function(id){
		var that = this;
		this._needLogin(function(){
			if(that.account.roles.admin || that.account.roles.agent){
				that.appEvents.trigger('set:brand', '应用管理');
				var userAppView = new UserAppView({id: id,account: that.account});
				that.changeView(userAppView);
				userAppView.trigger('load');
			}

		});
	},

	userAdd: function(){
		var that = this;
		this._needLogin(function(){
			if(that.account.roles.admin || that.account.roles.agent){
				that.appEvents.trigger('set:brand', '新增用户');
				var userEditView = new UserEditView({id: null, account: that.account});
				that.changeView(userEditView);
				userEditView.trigger('load');
			}
		});
	},

	lottery3d: function(id){
		var that = this;
		this._needLogin(function(){
			if(that.account.roles.user){
				that.appEvents.trigger('set:brand', '3D福彩');
				var lottery3dView = new Lottery3dView({account: that.account,id:id});
				that.changeView(lottery3dView);
				lottery3dView.trigger('load');
			}

		});
	},

	orderIndex: function(){
		var that = this;
		this._needLogin(function(){
			if(that.account.roles.user){
				that.appEvents.trigger('set:brand', '订单管理');
				var orderIndexView = new OrderIndexView({account: that.account});
				that.changeView(orderIndexView);
				orderIndexView.trigger('load');
			}

		});
	},

	orderImport: function(){
		var that = this;
		this._needLogin(function(){
			if(that.account.roles.user){
				that.appEvents.trigger('set:brand', '导入订单');
				var orderImportView = new OrderImportView({account: that.account});
				that.changeView(orderImportView);
				orderImportView.trigger('load');
			}
		});

	},

	orderAdd: function(){
		var that = this;
		this._needLogin(function(){
			if(that.account.roles.user){
				that.appEvents.trigger('set:brand', '新增订单');
				var orderEditView = new OrderEditView({account: that.account, router: that});
				that.changeView(orderEditView);
				orderEditView.trigger('load');
			}

		});
	},

	orderUpdate: function(id){
		var that = this;
		this._needLogin(function(){
			if(that.account.roles.user){
				that.appEvents.trigger('set:brand', '修改订单');
				var orderEditView = new OrderEditView({account: that.account,id: id, router: that});
				that.changeView(orderEditView);
				orderEditView.trigger('load');
			}

		});
	},

	orderDetail: function(id){
		var that = this;
		this._needLogin(function(){
			if(that.account.roles.user){
				that.appEvents.trigger('set:brand', '订单详情');
				var orderDetailView = new OrderDetailView({account: that.account,id: id});
				that.changeView(orderDetailView);
				orderDetailView.trigger('load');
			}
		});

	},

	orderRecords: function(id){
		var that = this;
		this._needLogin(function(){
			if(that.account.roles.user || that.account.roles.app){
				that.appEvents.trigger('set:brand','出票记录');
				var recordIndexView = new RecordIndexView({account: that.account, url: '/records?type=order&id=' + id});
				that.changeView(recordIndexView);
				recordIndexView.trigger('load');
			}

		});
	},

	recordIndex: function(){
		var that = this;
		this._needLogin(function(){
			if(that.account.roles.user || that.account.roles.app){
				that.appEvents.trigger('set:brand','出票记录');
				var recordIndexView = new RecordIndexView({account: that.account,url: '/records'});
				that.changeView(recordIndexView);
				recordIndexView.trigger('load');
			}
		});

	},

	recordUpdate: function(id){
		var that = this;
		this._needLogin(function(){
			if(that.account.roles.user){
				that.appEvents.trigger('set:brand', '修改彩票');
				var recordEditView = new RecordEditView({account: that.account,id: id});
				that.changeView(recordEditView);
				recordEditView.trigger('load');
			}
		});

	},

	recordStats: function(){
		var that = this;
		this._needLogin(function(){
			if(that.account.roles.user || that.account.roles.app){
				that.appEvents.trigger('set:brand','使用记录');
				var recordStatsView = new RecordStatsView({account: that.account});
				that.changeView(recordStatsView);
				recordStatsView.trigger('load');
			}

		});
	},

});

