var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    loadingTemplate = require('../templates/loading.tpl'),
    projectAddTemplate = require('../templates/projectAdd.tpl'),
    ProjectFormView = require('./_FormProject');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#content',

	initialize: function(options){
		this.socketEvents = options.socketEvents;
		this.on('load', this.load, this);
	},

	load: function(){
		var projectFormView = new ProjectFormView({socketEvents: this.socketEvents});
		projectFormView.done = function(project){
			window.location.hash = 'project/'+ project._id +'/member/add';
		};
		projectFormView.trigger('load');
	},

	render: function(){
		this.$el.html(projectAddTemplate());
		return this;
	}
});