var Router = require('../_base/__Router');
var HelpIndexView = require('./views/HelpIndex');

exports = module.exports = Router.extend({

	routes: {
		'help/index': 'helpIndex',
	},

	helpIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand','帮助中心');
		var helpIndexView = new HelpIndexView({
			router: this,
			el: '#content',
		});
		this.appEvents.trigger('changeView',helpIndexView);
		helpIndexView.trigger('load');
	},	

});