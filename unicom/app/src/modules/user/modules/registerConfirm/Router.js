var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');
var config = require('./conf');
var LayoutView = require('./views/__Layout');
var RegisterConfirmView = require('./views/_AccountRegisterConfirm');

exports = module.exports = Backbone.Router.extend({

	currentView : null,
	appEvents: _.extend({},Backbone.Events),//app events

	initialize: function(){
		var layoutView = new LayoutView({
			appEvents: this.appEvents,
		});
		layoutView.trigger('load');
	},

	routes: {
		'email/:email/:code': 'email',
		'*path': 'index',
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

	email: function(email,code){
		this.appEvents.trigger('set:brand','账号激活');
		var registerConfirm = new RegisterConfirmView({
			el: '#content',
			email: email,
			code: code,
		});
		this.changeView(registerConfirm);
		registerConfirm.trigger('load');
	},

});