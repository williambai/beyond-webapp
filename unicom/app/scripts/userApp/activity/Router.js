var Router = require('../_base/__Router');
// var ActivityIndexView = require('./views/ActivityIndex');
var ActivityIndexView = require('./views/Index');

exports = module.exports = Router.extend({

	routes: {
		'activity/index': 'activityIndex',
	},

	activityIndex: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand', '同事圈');
		var activityIndexView = new ActivityIndexView({
			router: this,
			el: '#content'
		});
		this.appEvents.trigger('changeView',activityIndexView);
		activityIndexView.trigger('load');
	},
});