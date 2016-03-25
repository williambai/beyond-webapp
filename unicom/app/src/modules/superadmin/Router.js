var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');
var config = require('./conf');

var LayoutView = require('./views/__Layout');
var LoginView = require('../../views/_Login2');
var WeChatLoginView = require('../../views/_WeChatLogin');
var MyAccountViewView = require('../../views/_MyAccountView');
var MyAccountEditView = require('../../views/_MyAccountEdit');
var IndexView = require('./views/Index');

var FeatureIndexView = require('./views/FeatureIndex');
var FeatureEditView = require('./views/FeatureEdit');
var AppIndexView = require('./views/AppIndex');
var AppEditView = require('./views/AppEdit');
var RoleIndexView = require('./views/RoleIndex');
var RoleEditView = require('./views/RoleEdit');
var AccountIndexView = require('./views/AccountIndex');
var AccountEditView = require('./views/AccountEdit');
var CbssAccountIndexView = require('./views/CbssAccountIndex');
var CbssAccountEditView = require('./views/CbssAccountEdit');
var SessionIndexView = require('./views/SessionIndex');
var SessionEditView = require('./views/SessionEdit');
var WeChatCustomerIndexView = require('./views/WeChatCustomerIndex');
var WeChatCustomerEditView = require('./views/WeChatCustomerEdit');
var WeChatIndexView = require('./views/WeChatIndex');
var WeChatEditView = require('./views/WeChatEdit');

var FileIndexView = require('./views/_PlatformFileIndex');
var FileViewView = require('./views/_PlatformFileView');
var FileEditView = require('./views/_PlatformFileEdit');

var SmsIndexView = require('./views/_SmsIndex');
var SmsEditView = require('./views/_SmsEdit');


var WeChatMenuIndexView = require('./views/_WeChatMenuIndex');
var WeChatMenuEditView = require('./views/_WeChatMenuEdit');
var WeChatMenuExportView = require('./views/_WeChatMenuExport');


exports = module.exports = Backbone.Router.extend({
	appCode: config.app.nickname,
	account: null,//login account
	logined: false,
	currentView : null,
	appEvents: _.extend({},Backbone.Events),//app events

	routes: {
		'index': 'index',
		'login': 'login',
		'logout': 'logout',
		'wechat/login': 'wechatLogin',
		'profile/:id': 'profileView',
		'profile/edit/me': 'profileEdit',

		'session/index': 'sessionIndex',
		'session/edit/:id': 'sessionEdit',
		'app/index': 'appIndex',
		'app/add': 'appEdit',	
		'app/edit/:id': 'appEdit',
		'feature/index': 'featureIndex',
		'feature/add': 'featureEdit',	
		'feature/edit/:id': 'featureEdit',

		'file/index': 'fileIndex',
		'file/view/:id': 'fileView',
		'file/add': 'fileEdit',
		'file/edit/:id': 'fileEdit',

		'account/index': 'accountIndex',
		'account/add': 'accountEdit',
		'account/edit/:id': 'accountEdit',
		'role/index': 'roleIndex',
		'role/add': 'roleEdit',
		'role/edit/:id': 'roleEdit',

		'cbss/account/index': 'cbssAccountIndex',
		'cbss/account/add': 'cbssAccountEdit',
		'cbss/account/edit/:id': 'cbssAccountEdit',

		'sms/index': 'smsIndex',
		'sms/add': 'smsEdit',
		'sms/edit/:id': 'smsEdit',

		'wechat/customer/index': 'wechatCustomerIndex',
		'wechat/customer/add': 'wechatCustomerEdit',
		'wechat/customer/edit/:id': 'wechatCustomerEdit',

		'wechat/index': 'wechatIndex',
		'wechat/add': 'wechatEdit',
		'wechat/edit/:id': 'wechatEdit',

		'wechat/:wid/menu/index': 'wechatMenuIndex',
		'wechat/:wid/menu/add': 'wechatMenuEdit',
		'wechat/:wid/menu/edit/:id': 'wechatMenuEdit',
		'wechat/:wid/menu/export': 'wechatMenuExport',

		'*path': 'index',
	},

	initialize: function(){
		this.appEvents.on('logined',this.onLogined,this);
		this.appEvents.on('logout', this.onLogout,this);
		this.layoutView = new LayoutView({
			appEvents: this.appEvents,
		});
		this.layoutView.trigger('load');
	},

	onLogined: function(account) {
		var that = this;
		this.account = account;
		this.logined = true;
		/** default menu */
		// this.layoutView.trigger('update:menu', _.sortBy(_.flatten(_.values(config.menu)), 'id'));
		// return;
		/** -OR- customize menu */
		// $.ajax({
		// 	url: config.api.host + '/platform/apps/' + that.appCode,
		// 	type: 'GET',
		// 	xhrFields: {
		// 		withCredentials: true
		// 	},
		// }).done(function(app) {
		// 	var menu_default = config.menu || [];
		// 	//** app features
		// 	var app_features = (app && app.features) || [];
		// 	//** user grant features
		// 	var grant_features = _.keys(that.account.grant);
		// 	//** both app and user have features 
		// 	var features = _.intersection(app_features,grant_features);
		// 	// console.log(features);
		// 	var menu_granted = [];
		// 	_.each(menu_default,function(menu){
		// 		if(_.isEmpty(menu.features)) return menu_granted.push(menu);
		// 		var menu_features = menu.features || [];
		// 		var intersection = _.intersection(features,menu_features);
		// 		if(!_.isEmpty(intersection)) menu_granted.push(menu);
		// 	});
		// 	that.layoutView.trigger('update:menu', menu_granted);
		// });
		var menu_default = config.menu || [];
		var features = _.keys(that.account.grant);
		// console.log(features);
		var menu_granted = [];
		_.each(menu_default,function(menu){
			if(_.isEmpty(menu.features)) return menu_granted.push(menu);
			var menu_features = menu.features || [];
			var intersection = _.intersection(features,menu_features);
			if(!_.isEmpty(intersection)) menu_granted.push(menu);
		});
		that.layoutView.trigger('update:menu', menu_granted);
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
		});
		this.changeView(indexView);
		indexView.trigger('load');
	},	
	login: function(){
		if(this.logined){
			window.location.hash = 'index';
			return;
		}
		this.appEvents.trigger('set:brand','登录');
		var loginView = new LoginView({
			appCode: this.appCode,
			router: this,
			el: '#content',
			appEvents: this.appEvents,
		});
		this.changeView(loginView);
		loginView.trigger('load');
	},

	wechatLogin: function() {
		if (this.logined) {
			window.location.hash = 'index';
			return;
		}
		this.appEvents.trigger('set:brand', '微信登录');
		var loginView = new WeChatLoginView({
			router: this,
			appCode: this.appCode,
			el: '#content',
			appEvents: this.appEvents,
		});
		this.changeView(loginView);
		loginView.trigger('load');
	},

	logout: function(){
		this.logined = false;
		window.location.hash = 'login';
		$.ajax({
			url: config.api.host + '/super/logout',
			type: 'GET',
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
		});
	},

	profileView: function(id) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '个人资料');
		if (id == this.account.id) {
			id = 'me';
		}
		var profileViewView = new MyAccountViewView({
			router: this,
			el: '#content',
			id: id,
			appEvents: this.appEvents,
		});
		this.changeView(profileViewView);
		profileViewView.trigger('load');
	},


	profileEdit: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '编辑个人资料');
		var profileEditView = new MyAccountEditView({
			router: this,
			el: '#content',
			id: 'me',
		});
		this.changeView(profileEditView);
		profileEditView.trigger('load');
	},

	appIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','应用管理');
		var appIndexView = new AppIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(appIndexView);
		appIndexView.trigger('load');
	},

	appEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','新增应用');
		var appEditView = new AppEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(appEditView);
		appEditView.trigger('load');
	},

	sessionIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','会话管理');
		var sessionIndexView = new SessionIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(sessionIndexView);
		sessionIndexView.trigger('load');
	},

	sessionEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','编辑会话');
		var sessionEditView = new SessionEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(sessionEditView);
		sessionEditView.trigger('load');
	},
		
	featureIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','资源管理');
		var featureIndexView = new FeatureIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(featureIndexView);
		featureIndexView.trigger('load');
	},

	featureEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改资源');
		var featureEditView = new FeatureEditView({
			router: this,
			el: '#content',
			id: id
		});
		this.changeView(featureEditView);
		featureEditView.trigger('load');
	},


	fileIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','文件管理');
		var fileIndexView = new FileIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(fileIndexView);
		fileIndexView.trigger('load');
	},


	fileView: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','文件内容');
		var fileViewView = new FileViewView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(fileViewView);
		fileViewView.trigger('load');
	},


	fileEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改文件内容');
		var fileEditView = new FileEditView({
			router: this,
			el: '#content',
			id: id
		});
		this.changeView(fileEditView);
		fileEditView.trigger('load');
	},


	accountIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','账户管理');
		var accountIndexView = new AccountIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(accountIndexView);
		accountIndexView.trigger('load');
	},

	accountEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改账户');
		var accountEditView = new AccountEditView({
			router: this,
			el: '#content',
			id: id
		});
		this.changeView(accountEditView);
		accountEditView.trigger('load');
	},

	roleIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','角色管理');
		var roleIndexView = new RoleIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(roleIndexView);
		roleIndexView.trigger('load');
	},

	roleEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改角色');
		var roleEditView = new RoleEditView({
			router: this,
			el: '#content',
			id: id
		});
		this.changeView(roleEditView);
		roleEditView.trigger('load');
	},

	cbssAccountIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','CBSS账户管理');
		var cbssAccountIndexView = new CbssAccountIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(cbssAccountIndexView);
		cbssAccountIndexView.trigger('load');
	},	

	cbssAccountEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改CBSS账户');
		var cbssAccountEditView = new CbssAccountEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(cbssAccountEditView);
		cbssAccountEditView.trigger('load');
	},	

	smsIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','SMS管理');
		var smsIndexView = new SmsIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(smsIndexView);
		smsIndexView.trigger('load');
	},	

	smsEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改SMS');
		var smsEditView = new SmsEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(smsEditView);
		smsEditView.trigger('load');
	},	

	wechatCustomerIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','微信客户管理');
		var wechatCustomerIndexView = new WeChatCustomerIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(wechatCustomerIndexView);
		wechatCustomerIndexView.trigger('load');
	},	

	wechatCustomerEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改微信客户');
		var wechatCustomerEditView = new WeChatCustomerEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(wechatCustomerEditView);
		wechatCustomerEditView.trigger('load');
	},	


	wechatIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','微信公众号管理');
		var wechatIndexView = new WeChatIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(wechatIndexView);
		wechatIndexView.trigger('load');
	},	

	wechatEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改微信公众号');
		var wechatEditView = new WeChatEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(wechatEditView);
		wechatEditView.trigger('load');
	},	


	wechatMenuIndex: function(wid){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','微信菜单管理');
		var wechatMenuIndexView = new WeChatMenuIndexView({
			router: this,
			el: '#content',
			wid: wid,
		});
		this.changeView(wechatMenuIndexView);
		wechatMenuIndexView.trigger('load');
	},	

	wechatMenuEdit: function(wid,id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','微信修改菜单');
		var wechatMenuEditView = new WeChatMenuEditView({
			router: this,
			el: '#content',
			wid: wid,
			id: id,
		});
		this.changeView(wechatMenuEditView);
		wechatMenuEditView.trigger('load');
	},	

	wechatMenuExport: function(wid){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','更新菜单');
		var wechatMenuExportView = new WeChatMenuExportView({
			router: this,
			el: '#content',
			wid: wid,
		});
		this.changeView(wechatMenuExportView);
		wechatMenuExportView.trigger('load');
	},	

});