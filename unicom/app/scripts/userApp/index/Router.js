var Router = require('../_base/__Router');
var IndexView = require('./views/Index');

exports = module.exports = Router.extend({

	routes: {
		'index': 'index',
	},

	index: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		// this.appEvents.trigger('set:brand', '贵州联通沃助手');
		var indexView = new IndexView({
			router: this,
		});
		this.appEvents.trigger('changeView',indexView);
		indexView.trigger('load');
	},

});