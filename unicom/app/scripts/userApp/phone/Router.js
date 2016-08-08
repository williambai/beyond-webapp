var Router = require('../_base/__Router');
var PhoneIndexView = require('./views/PhoneIndex');

exports = module.exports = Router.extend({

	routes: {
		'phone/index': 'phoneIndex',
	},

	phoneIndex: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand', '同事圈');
		var phoneIndexView = new PhoneIndexView({
			router: this,
			el: '#content'
		});
		this.appEvents.trigger('changeView',phoneIndexView);
		phoneIndexView.trigger('load');
	},

});