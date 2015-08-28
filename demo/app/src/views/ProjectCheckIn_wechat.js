var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    projectCheckInTemplate = require('../../assets/templates/projectCheckIn_wechat.tpl');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({
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
		this.$el.html(projectCheckInTemplate({project: this.model.toJSON()}));
		return this;
	}
});