var Router = require('../_base/__Router');
var CustomerIndexView = require('./views/CustomerIndex');

exports = module.exports = Router.extend({

	routes: {
		'customer/index': 'customerIndex',
	},

	customerIndex: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand', '我的客户');
		var customerIndexView = new CustomerIndexView({
			router: this,
			el: '#content'
		});
		this.changeView(customerIndexView);
		customerIndexView.trigger('load');
	},
});