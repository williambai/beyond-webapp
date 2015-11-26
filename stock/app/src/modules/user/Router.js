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

var TradingRecordView = require('./views/TradingRecord');
var TradingGraphView = require('./views/TradingGraph');
var TradingStrategyView = require('./views/TradingStrategy');
var StrategyTradingRecordView = require('./views/StrategyTradingRecord');
var StrategyTradingGraphView = require('./views/StrategyTradingGraph');
var StrategyEditView = require('./views/StrategyEdit');

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
		'strategy': 'strategy',
		'strategy/edit(/:symbol)': 'strategyEdit',
		'strategy/trading/record/:symbol/:from': 'strategyTradingRecord',
		'strategy/trading/graph/:symbol/:from': 'strategyTradingGraph',
		'trading/record': 'tradingRecord',
		'trading/graph/:symbol': 'tradingGraph',
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

	strategy: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '交易品种');
		var tradingStrategyView = new TradingStrategyView();
		this.changeView(tradingStrategyView);
		tradingStrategyView.trigger('load');
	},

	strategyEdit: function(symbol) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '品种详情');
		var strategyEditView = new StrategyEditView({symbol:symbol});
		this.changeView(strategyEditView);
		strategyEditView.trigger('load');
	},

	strategyTradingRecord: function(symbol,from){
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '本轮交易记录');
		var tradingRecordView = new StrategyTradingRecordView({
			symbol: symbol,
			from: from
		});
		this.changeView(tradingRecordView);
		tradingRecordView.trigger('load');
	},

	strategyTradingGraph: function(symbol,from) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '本轮交易图表');
		var tradingGraphView = new StrategyTradingGraphView({symbol: symbol,from: from});
		this.changeView(tradingGraphView);
		tradingGraphView.trigger('load');
	},

	tradingRecord: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '交易记录');
		var tradingRecordView = new TradingRecordView();
		this.changeView(tradingRecordView);
		tradingRecordView.trigger('load');
	},

	tradingGraph: function(symbol) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '交易图表');
		var tradingGraphView = new TradingGraphView({symbol: symbol});
		this.changeView(tradingGraphView);
		tradingGraphView.trigger('load');
	},

});