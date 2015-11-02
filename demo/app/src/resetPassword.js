var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');
var config = require('./conf');
var LayoutView = require('./views/_LayoutResetPassword');
var ResetPassword = require('./models/ResetPassword');
var ResetPasswordView = require('./views/ResetPassword');

var Router = Backbone.Router.extend({

	currentView : null,
	appEvents: _.extend({},Backbone.Events),//app events
	socketEvents: _.extend({},Backbone.Events),//socket events ---Deprecated!

	initialize: function(){
		var layoutView = new LayoutView({
			appEvents: this.appEvents,
			socketEvents: this.socketEvents,
		});
		layoutView.trigger('load');
	},

	routes: {
		'': 'resetPassword',
		'reset/token/:token': 'resetPassword',
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
		window.location.href = '/';
	},

	resetPassword: function(token){
		this.appEvents.trigger('set:brand','密码重置');
		var resetPassword = new ResetPasswordView({token:token});
		this.changeView(resetPassword);
		resetPassword.trigger('load');
	},

});

var router = new Router();
Backbone.history.start();