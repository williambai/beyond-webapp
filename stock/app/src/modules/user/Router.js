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

var TradingIndexView = require('./views/_TradingIndex');
var TradingGraphView = require('./views/TradingGraph');
var StrategyTradingListView = require('./views/_StrategyTradingList');
var StrategyTradingGraphView = require('./views/_StrategyTradingGraph');

var StrategyIndexView = require('./views/_StrategyIndex');
var StrategyAddView = require('./views/_StrategyAdd');
var StrategyEditView = require('./views/_StrategyEdit');
var StrategyViewView = require('./views/_StrategyView');
var StrategyExportView = require('./views/_StrategyExport');
var StrategyImportView = require('./views/_StrategyImport');
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
		'strategy': 'strategyIndex',
		'strategy/new': 'strategyAdd',
		'strategy/edit/:id': 'strategyEdit',
		'strategy/view/:id': 'strategyView',
		'strategy/export': 'strategyExport',
		'strategy/import': 'strategyImport',
		'strategy/trading/record/:symbol/:from': 'strategyTradingList',
		'strategy/trading/graph/:symbol/:from': 'strategyTradingGraph',
		'trading': 'tradingIndex',
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

	register: function() {
		if (this.logined) {
			window.location.hash = 'index';
			return;
		}
		this.appEvents.trigger('set:brand', '注册');
		var registerView = new RegisterView({
			el: '#content'
		});
		this.changeView(registerView);
		registerView.trigger('load');
	},

	forgotPassword: function() {
		if (this.logined) {
			window.location.hash = 'index';
			return;
		}
		this.appEvents.trigger('set:brand', '找回密码');
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

	strategyIndex: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '交易品种');
		var strategyIndexView = new StrategyIndexView({
			el: '#content'
		});
		this.changeView(strategyIndexView);
		strategyIndexView.trigger('load');
	},

	strategyAdd: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '新增交易品种');
		var strategyEditView = new StrategyAddView({
			el: '#content'
		});
		this.changeView(strategyEditView);
		strategyEditView.trigger('load');
	},

	strategyView: function(id) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '查看交易品种');
		var strategyViewView = new StrategyViewView({
			id: id,
			el: '#content'
		});
		this.changeView(strategyViewView);
		strategyViewView.trigger('load');
	},

	strategyEdit: function(id) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '编辑交易品种');
		var strategyEditView = new StrategyEditView({
			id: id,
			el: '#content'
		});
		this.changeView(strategyEditView);
		strategyEditView.trigger('load');
	},

	strategyExport: function(id) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '导出交易品种');
		var strategyExportView = new StrategyExportView({
			id: id,
			el: '#content'
		});
		this.changeView(strategyExportView);
		strategyExportView.trigger('load');
	},

	strategyImport: function(id) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '导入交易品种');
		var strategyImportView = new StrategyImportView({
			id: id,
			el: '#content'
		});
		this.changeView(strategyImportView);
		strategyImportView.trigger('load');
	},

	strategyTradingList: function(symbol, from) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '本轮交易记录');
		var tradingListView = new StrategyTradingListView({
			el: '#content',
			symbol: symbol,
			from: from
		});
		this.changeView(tradingListView);
		tradingListView.trigger('load');
	},

	strategyTradingGraph: function(symbol, from) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '本轮交易图表');
		var tradingGraphView = new StrategyTradingGraphView({
			symbol: symbol,
			from: from,
			el: '#content'
		});
		this.changeView(tradingGraphView);
		tradingGraphView.trigger('load');
	},

	tradingIndex: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '交易记录');
		var tradingIndexView = new TradingIndexView();
		this.changeView(tradingIndexView);
		tradingIndexView.trigger('load');
	},

	tradingGraph: function(symbol) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '交易图表');
		var tradingGraphView = new TradingGraphView({
			symbol: symbol
		});
		this.changeView(tradingGraphView);
		tradingGraphView.trigger('load');
	},

});