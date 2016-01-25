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

var PlatformAppIndexView = require('./views/_PlatformAppIndex');
var PlatformAppEditView = require('./views/_PlatformAppEdit');
var PlatformSessionIndexView = require('./views/_PlatformSessionIndex');
var PlatformSessionEditView = require('./views/_PlatformSessionEdit');

var FeatureIndexView = require('./views/_PlatformFeatureIndex');
var FeatureEditView = require('./views/_PlatformFeatureEdit');

var AccountIndexView = require('./views/_AccountIndex');
var AccountEditView = require('./views/_AccountEdit');

var CbssAccountIndexView = require('./views/_CbssAccountIndex');
var CbssAccountEditView = require('./views/_CbssAccountEdit');

var SmsIndexView = require('./views/_SmsIndex');
var SmsEditView = require('./views/_SmsEdit');

var PlatformWeChatCustomerIndexView = require('./views/_PlatformWeChatCustomerIndex');
var PlatformWeChatCustomerEditView = require('./views/_PlatformWeChatCustomerEdit');

var WeChatIndexView = require('./views/_WeChatIndex');
var WeChatEditView = require('./views/_WeChatEdit');
var WeChatMenuIndexView = require('./views/_WeChatMenuIndex');
var WeChatMenuEditView = require('./views/_WeChatMenuEdit');
var WeChatMenuExportView = require('./views/_WeChatMenuExport');

var RoleIndexView = require('./views/_RoleIndex');
var RoleEditView = require('./views/_RoleEdit');

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
		var layoutView = new LayoutView({
			appEvents: this.appEvents,
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
		//this.appEvents.trigger('set:brand','首页');
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
		//this.appEvents.trigger('set:brand','登录');
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
		//this.appEvents.trigger('set:brand', '登录');
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
		//this.appEvents.trigger('set:brand', '编辑个人资料');
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
		var appIndexView = new PlatformAppIndexView({
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
		var appEditView = new PlatformAppEditView({
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
		var sessionIndexView = new PlatformSessionIndexView({
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
		var sessionEditView = new PlatformSessionEditView({
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
		//this.appEvents.trigger('set:brand','功能设置');
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
		//this.appEvents.trigger('set:brand','修改功能');
		var featureEditView = new FeatureEditView({
			router: this,
			el: '#content',
			id: id
		});
		this.changeView(featureEditView);
		featureEditView.trigger('load');
	},

	accountIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand','功能设置');
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
		//this.appEvents.trigger('set:brand','修改功能');
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
		//this.appEvents.trigger('set:brand','功能设置');
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
		//this.appEvents.trigger('set:brand','修改功能');
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
		this.appEvents.trigger('set:brand','微信公众号管理');
		var wechatCustomerIndexView = new PlatformWeChatCustomerIndexView({
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
		this.appEvents.trigger('set:brand','修改微信公众号');
		var wechatCustomerEditView = new PlatformWeChatCustomerEditView({
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