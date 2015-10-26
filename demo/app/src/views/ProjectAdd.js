var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    loadingTemplate = require('../../assets/templates/loading.tpl'),
    projectAddTemplate = require('../../assets/templates/projectAdd.tpl'),
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
		projectFormView.done = function(){
			window.location.hash = 'friend/add';
		};
		projectFormView.trigger('load');
	},

	render: function(){
		this.$el.html(projectAddTemplate());
		return this;
	}
});