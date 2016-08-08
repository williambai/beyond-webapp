var Router = require('../_base/__Router');
var FeedbackIndexView = require('./views/FeedbackIndex');
var FeedbackEditView = require('./views/FeedbackEdit');

exports = module.exports = Router.extend({

	routes: {
		'feedback/index': 'feedbackIndex',
		'feedback/add': 'feedbackEdit',
	},
	
	feedbackIndex: function(){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand','意见反馈');
		var feedbackIndexView = new FeedbackIndexView({
			router: this,
			el: '#content',
		});
		this.changeView(feedbackIndexView);
		feedbackIndexView.trigger('load');
	},	

	feedbackEdit: function(id){
		if(!this.logined){
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand','反映问题');
		var feedbackEditView = new FeedbackEditView({
			router: this,
			el: '#content',
			id: id,
		});
		this.appEvents.trigger('changeView',feedbackEditView);
		feedbackEditView.trigger('load');
	},	

});