var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');
var config = require('./conf');

var LayoutView = require('./views/__Layout');
var LoginView = require('./views/_MyAccountLogin');
var IndexView = require('./views/Index');

var PlatformAppIndexView = require('./views/_PlatformAppIndex');
var PlatformAppEditView = require('./views/_PlatformAppEdit');

var FeatureIndexView = require('./views/_PlatformFeatureIndex');
var FeatureEditView = require('./views/_PlatformFeatureEdit');

var AccountIndexView = require('./views/_AccountIndex');
var AccountEditView = require('./views/_AccountEdit');

var RoleIndexView = require('./views/_RoleIndex');
var RoleEditView = require('./views/_RoleEdit');

exports = module.exports = Backbone.Router.extend({

	account: null,//login account
	logined: false,
	currentView : null,
	appEvents: _.extend({},Backbone.Events),//app events

	routes: {
		'index': 'index',
		'login': 'login',
		'logout': 'logout',
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
});