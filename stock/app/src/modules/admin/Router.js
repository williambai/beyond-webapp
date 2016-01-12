var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');
var config = require('./conf');
var validation = require('backbone-validation');
_.extend(Backbone.Model.prototype,validation.mixin);

var LayoutView = require('./views/__Layout');
var LoginView = require('./views/_AccountLogin');
var IndexView = require('./views/Index');

var PlatformView = require('./views/_PlatformControl');
var StockAccountIndexView = require('./views/_StockAccountIndex');
var StockAccountEditView = require('./views/_StockAccountEdit');



var CaptchaView = require('./views/_PlatformCaptcha');

exports = module.exports = Backbone.Router.extend({

	account: null,//login account
	logined: false,
	currentView : null,
	appEvents: _.extend({},Backbone.Events),//app events

	routes: {
		'index': 'index',
		'login': 'login',
		'logout': 'logout',
		'platform': 'platformControl',

		'stock/account/index': 'stockAccountIndex',
		'stock/account/add': 'stockAccountEdit',
		'stock/account/edit/:id': 'stockAccountEdit',

		'captcha': 'captcha',
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
			url: config.api.host + '/admin/logout',
			type: 'GET',
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
		});
	},
	platformControl: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','平台控制');
		var platformView = new PlatformView({
		});
		this.changeView(platformView);
		platformView.trigger('load');
	},


	stockAccountIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','CBSS账户管理');
		var stockAccountIndexView = new StockAccountIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(stockAccountIndexView);
		stockAccountIndexView.trigger('load');
	},	

	stockAccountEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','修改CBSS账户');
		var stockAccountEditView = new StockAccountEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(stockAccountEditView);
		stockAccountEditView.trigger('load');
	},	


	captcha: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		this.appEvents.trigger('set:brand','验证码处理');
		var captchaView = new CaptchaView({
		});
		this.changeView(captchaView);
		captchaView.trigger('load');
	},
});