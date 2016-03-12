var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');
var validation = require('backbone-validation');
_.extend(Backbone.Model.prototype,validation.mixin);

var LayoutView = require('./views/__Layout');
var RegisterView = require('./views/_AccountRegister');
var ForgotPasswordView = require('./views/_AccountForgotPassword');
var LoginView = require('./views/_AccountLogin');
var ProfileViewView = require('./views/_AccountView');
var ProfileEditView = require('./views/_AccountEdit');
var IndexView = require('./views/Index');

var TradeAccountIndexView = require('./views/_TradeAccountIndex');
var TradeAccountEditView = require('./views/_TradeAccountEdit');

var TradeStrategyIndexView = require('./views/_TradeStrategyIndex');
var TradeStrategyEditView = require('./views/_TradeStrategyEdit');
var TradeStrategyViewView = require('./views/_TradeStrategyView');
var TradeStrategyInvestView = require('./views/_TradeStrategyInvest');

var TradeTransactionIndexView = require('./views/_TradeTransactionIndex');
var TradeTransactionGraphView = require('./views/TradeTransactionGraph');

var TradePortfolioIndexView = require('./views/_TradePortfolioIndex');
var TradePortfolioViewView = require('./views/_TradePortfolioView');
var TradePortfolioHistroyIndexView = require('./views/_TradePortfolioHistroyIndex');
var TradePortfolioHistroyViewView = require('./views/_TradePortfolioHistroyView');

var HomeIndexView = require('./views/_HomeIndex');

// var StrategyTradingListView = require('./views/_StrategyTradingList');
// var StrategyTradingGraphView = require('./views/_StrategyTradingGraph');
// var StrategyAddView = require('./views/_StrategyAdd');
// var StrategyEditView = require('./views/_StrategyEdit');
// var StrategyViewView = require('./views/_StrategyView');
// var StrategyExportView = require('./views/_StrategyExport');
// var StrategyImportView = require('./views/_StrategyImport');


var config = require('./conf');

exports = module.exports = Backbone.Router.extend({

	account: null, //login account
	logined: false,
	currentView: null,
	appEvents: _.extend({}, Backbone.Events), //app events

	routes: {
		'': 'home',
		'index': 'home',
		'login': 'login',
		'logout': 'logout',
		'register': 'register',
		'forgotpassword': 'forgotPassword',
		'profile/:id': 'profileView',
		'profile/me/edit': 'profileEdit',

		'trade/strategy/index': 'tradeStrategyIndex',
		'trade/strategy/add': 'tradeStrategyEdit',
		'trade/strategy/edit/:id': 'tradeStrategyEdit',
		'trade/strategy/view/:id': 'tradeStrategyView',
		'trade/strategy/invest/:id': 'tradeStrategyInvest',

		'trade/portfolio/index': 'tradePortfolioIndex',
		'trade/portfolio/view/:id': 'tradePortfolioView',

		'trade/portfolio/histroy/index': 'tradePortfolioHistroyIndex',
		'trade/portfolio/histroy/view/:id': 'tradePortfolioHistroyView',

		'trade/transaction/index': 'tradeTransactionIndex',
		// 'trade/transaction/graph/:symbol': 'tradeTransactionGraph',

		'trade/account/index': 'tradeAccountIndex',
		'trade/account/add': 'tradeAccountEdit',
		'trade/account/edit/:id': 'tradeAccountEdit',

		// 'trade/add': 'strategyAdd',
		// 'trade/edit/:id': 'strategyEdit',
		// 'strategy/view/:id': 'strategyView',
		// 'strategy/export': 'strategyExport',
		// 'strategy/import': 'strategyImport',
		// 'strategy/trading/record/:symbol/:from': 'strategyTradingList',
		// 'strategy/trading/graph/:symbol/:from': 'strategyTradingGraph',

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
		var indexView = new IndexView({
			el: '#content'			
		});
		this.changeView(indexView);
		indexView.trigger('load');
	},

	home: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '首页');
		var indexView = new HomeIndexView({
			el: '#content'			
		});
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


	tradeStrategyIndex: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '交易策略管理');
		var tradeStrategyIndexView = new TradeStrategyIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(tradeStrategyIndexView);
		tradeStrategyIndexView.trigger('load');
	},

	tradeStrategyEdit: function(id) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '编辑交易策略');
		var tradeStrategyEditView = new TradeStrategyEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(tradeStrategyEditView);
		tradeStrategyEditView.trigger('load');
	},

	tradeStrategyView: function(id) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '交易策略详情');
		var tradeStrategyViewView = new TradeStrategyViewView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(tradeStrategyViewView);
		tradeStrategyViewView.trigger('load');
	},

	tradeStrategyInvest: function(id) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '选择投资交易商');
		var tradeStrategyInvestView = new TradeStrategyInvestView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(tradeStrategyInvestView);
		tradeStrategyInvestView.trigger('load');
	},

	tradePortfolioIndex: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '投资组合');
		var tradePortfolioIndexView = new TradePortfolioIndexView({
			router: this,
			el: '#content'
		});
		this.changeView(tradePortfolioIndexView);
		tradePortfolioIndexView.trigger('load');
	},


	tradePortfolioView: function(id) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '查看交易品种');
		var tradePortfolioViewView = new TradePortfolioViewView({
			router: this,
			id: id,
			el: '#content'
		});
		this.changeView(tradePortfolioViewView);
		tradePortfolioViewView.trigger('load');
	},

	tradePortfolioHistroyIndex: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '投资交易历史');
		var tradePortfolioHistroyIndexView = new TradePortfolioHistroyIndexView({
			router: this,
			el: '#content'
		});
		this.changeView(tradePortfolioHistroyIndexView);
		tradePortfolioHistroyIndexView.trigger('load');
	},


	tradePortfolioHistroyView: function(id) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '查看交易品种');
		var tradePortfolioHistroyViewView = new TradePortfolioHistroyViewView({
			router: this,
			id: id,
			el: '#content'
		});
		this.changeView(tradePortfolioHistroyViewView);
		tradePortfolioHistroyViewView.trigger('load');
	},

	// strategyAdd: function() {
	// 	if (!this.logined) {
	// 		window.location.hash = 'login';
	// 		return;
	// 	}
	// 	this.appEvents.trigger('set:brand', '新增交易品种');
	// 	var strategyEditView = new StrategyAddView({
	// 		el: '#content'
	// 	});
	// 	this.changeView(strategyEditView);
	// 	strategyEditView.trigger('load');
	// },

	// strategyView: function(id) {
	// 	if (!this.logined) {
	// 		window.location.hash = 'login';
	// 		return;
	// 	}
	// 	this.appEvents.trigger('set:brand', '查看交易品种');
	// 	var strategyViewView = new StrategyViewView({
	// 		id: id,
	// 		el: '#content'
	// 	});
	// 	this.changeView(strategyViewView);
	// 	strategyViewView.trigger('load');
	// },

	// strategyEdit: function(id) {
	// 	if (!this.logined) {
	// 		window.location.hash = 'login';
	// 		return;
	// 	}
	// 	this.appEvents.trigger('set:brand', '编辑交易品种');
	// 	var strategyEditView = new StrategyEditView({
	// 		id: id,
	// 		el: '#content'
	// 	});
	// 	this.changeView(strategyEditView);
	// 	strategyEditView.trigger('load');
	// },

	// strategyExport: function(id) {
	// 	if (!this.logined) {
	// 		window.location.hash = 'login';
	// 		return;
	// 	}
	// 	this.appEvents.trigger('set:brand', '导出交易品种');
	// 	var strategyExportView = new StrategyExportView({
	// 		id: id,
	// 		el: '#content'
	// 	});
	// 	this.changeView(strategyExportView);
	// 	strategyExportView.trigger('load');
	// },

	// strategyImport: function(id) {
	// 	if (!this.logined) {
	// 		window.location.hash = 'login';
	// 		return;
	// 	}
	// 	this.appEvents.trigger('set:brand', '导入交易品种');
	// 	var strategyImportView = new StrategyImportView({
	// 		id: id,
	// 		el: '#content'
	// 	});
	// 	this.changeView(strategyImportView);
	// 	strategyImportView.trigger('load');
	// },

	// strategyTradingList: function(symbol, from) {
	// 	if (!this.logined) {
	// 		window.location.hash = 'login';
	// 		return;
	// 	}
	// 	this.appEvents.trigger('set:brand', '本轮交易记录');
	// 	var tradingListView = new StrategyTradingListView({
	// 		el: '#content',
	// 		symbol: symbol,
	// 		from: from
	// 	});
	// 	this.changeView(tradingListView);
	// 	tradingListView.trigger('load');
	// },

	// strategyTradingGraph: function(symbol, from) {
	// 	if (!this.logined) {
	// 		window.location.hash = 'login';
	// 		return;
	// 	}
	// 	this.appEvents.trigger('set:brand', '本轮交易图表');
	// 	var tradingGraphView = new StrategyTradingGraphView({
	// 		symbol: symbol,
	// 		from: from,
	// 		el: '#content'
	// 	});
	// 	this.changeView(tradingGraphView);
	// 	tradingGraphView.trigger('load');
	// },

	tradeTransactionIndex: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand', '交易记录');
		var tradeTransactionIndexView = new TradeTransactionIndexView();
		this.changeView(tradeTransactionIndexView);
		tradeTransactionIndexView.trigger('load');
	},

	// tradeTransactionGraph: function(symbol) {
	// 	if (!this.logined) {
	// 		window.location.hash = 'login';
	// 		return;
	// 	}
	// 	this.appEvents.trigger('set:brand', '交易图表');
	// 	var tradeTransactionGraphView = new TradeTransactionGraphView({
	// 		symbol: symbol
	// 	});
	// 	this.changeView(tradeTransactionGraphView);
	// 	tradeTransactionGraphView.trigger('load');
	// },

	tradeAccountIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','账户管理');
		var tradeAccountIndexView = new TradeAccountIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(tradeAccountIndexView);
		tradeAccountIndexView.trigger('load');
	},	

	tradeAccountEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改账户');
		var tradeAccountEditView = new TradeAccountEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(tradeAccountEditView);
		tradeAccountEditView.trigger('load');
	},	

});