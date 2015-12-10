var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');


var LayoutView = require('./views/__Layout');
var RegisterView = require('./views/_AccountRegister');
var ForgotPasswordView = require('./views/_AccountForgotPassword');
var LoginView = require('./views/_AccountLogin');
var ProfileViewView = require('./views/_AccountView');
var ProfileEditView = require('./views/_AccountEdit');
var IndexView = require('./views/Index');

var CardIndexView = require('./views/_CardIndex');
var OrderCardAddView = require('./views/_OrderCardAdd');

var PushIndexView = require('./views/_PushIndex');
var DataIndexView = require('./views/_DataIndex');
var SmsIndexView = require('./views/_SmsIndex');

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
		'profile/:id': 'profileView',
		'profile/me/edit': 'profileEdit',

		'card/index': 'cardIndex',
		'order/card/:id/add': 'orderCardAdd',

		'push/index': 'pushIndex',
		'data/index': 'dataIndex',
		'sms/index': 'smsIndex',

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
		var registerView = new RegisterView({
			el: '#content'
		});
		this.changeView(registerView);
		registerView.trigger('load');
	},

	forgotPassword: function(){
		if(this.logined){
			window.location.hash = 'index';
			return;
		}
		this.appEvents.trigger('set:brand','找回密码');
		var forgotPassword = new ForgotPasswordView({
			el: '#content'
		});
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
			el: '#content',
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

	profileView: function(id) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '个人资料');
		if (id == this.account.id) {
			id = 'me';
		}
		var profileViewView = new ProfileViewView({
			el: '#content',
			id: id,
			appEvents: this.appEvents,
			socketEvents: this.socketEvents
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
		var profileEditView = new ProfileEditView({
			el: '#content'
		});
		this.changeView(profileEditView);
		profileEditView.trigger('load');
	},

	cardIndex: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '号卡');
		var cardIndexView = new CardIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(cardIndexView);
		cardIndexView.trigger('load');
	},

	orderCardAdd: function(id) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '卡号推荐');
		var orderCardAddView = new OrderCardAddView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(orderCardAddView);
		orderCardAddView.trigger('load');
	},

	pushIndex: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '内容推荐');
		var pushIndexView = new PushIndexView({
			el: '#content'
		});
		this.changeView(pushIndexView);
		pushIndexView.trigger('load');
	},

	dataIndex: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '流量推荐');
		var dataIndexView = new DataIndexView({
			el: '#content'
		});
		this.changeView(dataIndexView);
		dataIndexView.trigger('load');
	},

	smsIndex: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '流量推荐');
		var smsIndexView = new SmsIndexView({
			el: '#content'
		});
		this.changeView(smsIndexView);
		smsIndexView.trigger('load');
	},	
});