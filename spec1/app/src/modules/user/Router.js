var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');

var LayoutView = require('./views/__Layout');
var RegisterView = require('./views/Register');
var ForgotPasswordView = require('./views/ForgotPassword');
var LoginView = require('./views/Login');
var IndexView = require('./views/Index');
var ProfileView = require('./views/Profile');
var ProfileEditView = require('./views/ProfileEdit');

var config = require('./conf');

exports = module.exports = Backbone.Router.extend({

	account: null, //login account
	logined: false,
	currentView: null,
	appEvents: _.extend({}, Backbone.Events), //app events

	routes: {
		'index': 'index',
		'login': 'login',
		'logout': 'logout',
		'register': 'register',
		'forgotpassword': 'forgotPassword',
		'profile/:id': 'profile',
		'profile/me/edit': 'profileEdit',
		'*path': 'index',
	},

	initialize: function() {
		this.appEvents.on('logined', this.onLogined, this);
		this.appEvents.on('logout', this.onLogout, this);
		var layoutView = new LayoutView({
			appEvents: this.appEvents,
		});
		layoutView.trigger('load');
	},

	onLogined: function(account) {
		// console.log('++')
		// console.log(account);
		this.account = account;
		this.logined = true;
	},

	onLogout: function() {
		this.logined = false;
		window.location.reload();
	},

	changeView: function(view) {
		if (null != this.currentView) {
			this.currentView.undelegateEvents();
		}
		this.currentView = view;
		$('body').removeClass('has-navbar-bottom');
		$('.bottom-bar').remove();
		this.currentView.render();
	},

	index: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '首页');
		var indexView = new IndexView({});
		this.changeView(indexView);
		indexView.trigger('load');
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

	login: function() {
		if (this.logined) {
			window.location.hash = 'index';
			return;
		}
		this.appEvents.trigger('set:brand', '登录');
		var loginView = new LoginView({
			appEvents: this.appEvents,
		});
		this.changeView(loginView);
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

	profile: function(id) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '个人资料');
		if (id == this.account.id) {
			id = 'me';
		}
		var profileView = new ProfileView({
			id: id,
			appEvents: this.appEvents,
			socketEvents: this.socketEvents
		});
		this.changeView(profileView);
		profileView.trigger('load');
	},

	profileEdit: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '编辑个人资料');
		var profileEditView = new ProfileEditView();
		this.changeView(profileEditView);
		profileEditView.trigger('load');
	},

});