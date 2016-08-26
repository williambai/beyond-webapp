var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');

exports = module.exports = Backbone.Router.extend({
	account: null,
	logined: false,
	currentView: null,
	appEvents: null,

	initialize: function(options) {
		this.appEvents = (options && options.appEvents) || _.extend({}, Backbone.Events);
		this.appEvents.on('logined', this.onLogined, this);
		this.appEvents.on('logout', this.onLogout, this);
		this.appEvents.on('changeView', this.changeView, this);
	},

	onLogined: function(account) {
		this.logined = true;
		this.account = account || {};
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
		// $('body').removeClass('has-navbar-bottom');
		// $('.bottom-bar').remove();
		this.currentView.render();
	},
});