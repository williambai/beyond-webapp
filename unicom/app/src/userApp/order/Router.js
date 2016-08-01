var Router = require('../_base/__Router');
var OrderIndexView = require('./views/OrderIndex');

exports = module.exports = Router.extend({

	routes: {
		'order/index': 'orderIndex',
	},

	orderIndex: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand', '我的成绩');
		var orderIndexView = new OrderIndexView({
			router: this,
			el: '#content'
		});
		this.changeView(orderIndexView);
		orderIndexView.trigger('load');
	},
	
});