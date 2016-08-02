var Router = require('../_base/__Router');

exports = module.exports = Router.extend({
	routes: {
		'*path': 'notFound',
	},
	notFound: function() {
		if (!this.logined) {
			this.navigate('login');
			return;
		}
		window.location.hash = 'index';
	},
});