define(['text!templates/projectCheckIn_wechat.html'], function(projectCheckInTemplate){
	var ProjectCheckInView = Backbone.View.extend({
		el: '#content',
		template: _.template(projectCheckInTemplate),

		initialize: function(options){
		},

		events: {
			'click .close-web-viewer': 'closeWebViewer',
		},

		closeWebViewer: function(){
			return false;
		},

		render: function(){
			this.$el.html(this.template({project: this.model.toJSON()}));
			return this;
		}
	});
	return ProjectCheckInView;
});