var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');

var ProjectsView = require('./views/Projects_wechat');
var ProjectIndexView = require('./views/ProjectIndex_wechat');
var LoginView = require('./views/Login_wechat');
var ProfileView = require('./views/Profile_wechat');
var config = require('./conf/wechat');

Backbone.$ = $;

exports = module.exports = Backbone.Router.extend({

	originid: config.wechatOriginId,
	logined: false,
	currentView : null,
	appEvents: _.extend({},Backbone.Events),//app inner events
	routes: {
		'': 'projects',
		'index': 'projects',			
		'project/:id': 'project',
		'login': 'login',
		'profile': 'profile',
	},
	
	initialize: function(){
		this.appEvents.on('logined',this.onLogined,this);
		this.appEvents.on('logout', this.onLogout,this);
	},

	onLogined: function(account){
		// console.log('++')
		// console.log(account);
		this.account = account;
		this.logined = true;
	},

	onLogout: function(){
		this.logined = false;
		this.initialize();
	},

	changeView: function(view){
		if(null != this.currentView){
			this.currentView.undelegateEvents();
		}
		this.currentView = view;
		this.currentView.render();
	},

	login: function(){
		if(this.logined){
			window.location.hash = 'index';
			return;
		}
		this.appEvents.trigger('set:brand','登录');
		this.changeView(new LoginView({
			appEvents: this.appEvents,
		}));
	},

	profile: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		var profileView = new ProfileView({
				id:'me',
				appEvents: this.appEvents,
			});
		this.changeView(profileView);
		profileView.trigger('load');
	},

	projects: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		var projectsView = new ProjectsView({
		});
		projectsView.collection.url = '/accounts/me/projects';
		projectsView.trigger('load');
	},

	project: function(pid){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		var projectView = new ProjectIndexView({
			pid: pid,
			originid: this.originid,
		});
		this.changeView(projectView);
		projectView.trigger('load');
	}

});
