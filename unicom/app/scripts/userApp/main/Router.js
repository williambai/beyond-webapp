var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');
var config = require('../conf');

var Router = require('../_base/__Router');
var LayoutView = require('./views/__Layout');
var SideBarLeftView = require('./views/_SideBarLeft');
var RegisterView = require('./views/Register');
var ForgotPasswordView = require('./views/ForgotPassword');
var LoginView = require('./views/Login');
var WeChatLoginView = require('./views/WeChatLogin');
var MyAccountViewView = require('../profile/views/MyAccountView');
var MyAccountEditView = require('../profile/views/MyAccountEdit');

var IndexView = require('../index/views/Index');

exports = module.exports = Router.extend({

	appCode: config.app.nickname,
	account: null, //login account
	logined: false,
	currentView: null,
	appEvents: null, //app events

	routes: {
		'': 'index',
		'index': 'index',
		'login': 'login',
		'wechat/login': 'wechatLogin',
		'logout': 'logout',
		'register': 'register',
		'forgotpassword': 'forgotPassword',
	},

	initialize: function(options) {
		this.appEvents = (options && options.appEvents) || _.extend({}, Backbone.Events);
		this.appEvents.on('logined', this.onLogined, this);
		this.appEvents.on('logout', this.onLogout, this);
		this.layoutView = new LayoutView({
			appEvents: this.appEvents,
		});
		this.layoutView.trigger('load');
		this.sideBarLeftView = new SideBarLeftView();
	},

	onLogined: function(account) {
		var that = this;
		this.account = account;
		this.logined = true;
		/** default menu */
		// this.sideBarLeftView.trigger('update:menu', _.sortBy(_.flatten(_.values(config.menu)), 'id'));
		// return;
		/** -OR- customize menu */
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
		that.sideBarLeftView.trigger('update:menu', menu_granted);
	},

	onLogout: function() {
		this.logined = false;
		window.location.reload();
	},

	index: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		// this.appEvents.trigger('set:brand', '贵州联通沃助手');
		var indexView = new IndexView({
			router: this,
		});
		this.appEvents.trigger('changeView',indexView);
		indexView.trigger('load');
	},

	register: function() {
		if (this.logined) {
			window.location.hash = 'index';
			return;
		}
		//this.appEvents.trigger('set:brand','注册');
		var registerView = new RegisterView({
			router: this,
			appCode: this.appCode,
			el: '#content'
		});
		this.appEvents.trigger('changeView',registerView);
		registerView.trigger('load');
	},

	forgotPassword: function() {
		if (this.logined) {
			window.location.hash = 'index';
			return;
		}
		//this.appEvents.trigger('set:brand','找回密码');
		var forgotPassword = new ForgotPasswordView({
			router: this,
			el: '#content'
		});
		this.appEvents.trigger('changeView',forgotPassword);
		forgotPassword.trigger('load');
	},

	login: function() {
		if (this.logined) {
			window.location.hash = 'index';
			return;
		}
		//this.appEvents.trigger('set:brand', '登录');
		var loginView = new LoginView({
			router: this,
			appCode: this.appCode,
			el: '#content',
			appEvents: this.appEvents,
		});
		this.appEvents.trigger('changeView',loginView);
		loginView.trigger('load');
	},

	wechatLogin: function() {
		if (this.logined) {
			window.location.hash = 'index';
			return;
		}
		//this.appEvents.trigger('set:brand', '微信登录');
		var loginView = new WeChatLoginView({
			router: this,
			appCode: this.appCode,
			el: '#content',
			appEvents: this.appEvents,
		});
		this.appEvents.trigger('changeView',loginView);
		loginView.trigger('load');
	},

	logout: function() {
		this.logined = false;
		window.location.hash = 'login';
		$.ajax({
			url: config.api.host + '/logout',
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
		//this.appEvents.trigger('set:brand', '个人资料');
		if (id == this.account.id) {
			id = 'me';
		}
		var profileViewView = new MyAccountViewView({
			router: this,
			el: '#content',
			id: id,
			appEvents: this.appEvents,
		});
		this.appEvents.trigger('changeView',profileViewView);
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
		this.appEvents.trigger('changeView',profileEditView);
		profileEditView.trigger('load');
	},

});