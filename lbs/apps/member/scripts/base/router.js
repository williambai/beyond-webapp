define(['backbone'],function(Backbone){
	 var Router = Backbone.Router.extend({
			account: null,
			logined: false,
			currentView: null,

			initialize: function(options) {
				this.on('logined', this.onLogined, this);
				this.on('logout', this.onLogout, this);
				this.on('changeView', this.changeView, this);
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
	 return Router;
});