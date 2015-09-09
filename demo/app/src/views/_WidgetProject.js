var _ = require('underscore');
var $ = require('jquery'),
    Backbone = require('backbone'),
    projectTemplate = require('../../assets/templates/_widgetProject.tpl'),
    projectItemTemplate = require('../../assets/templates/_itemProject2.tpl'),
    ProjectCollection = require('../models/ProjectCollection');

Backbone.$ = $;

exports = module.exports = Backbone.View.extend({

	el: '#project-widget',

	initialize: function(options){
		this.socketEvents = options.socketEvents;
		this.collection = new ProjectCollection();
		this.collection.url = '/accounts/me/projects';
		this.collection.on('reset', this.onProjectCollectionReset, this);
		this.on('load', this.load,this);
	},

	load: function(){
		this.render();
		this.collection.fetch({reset: true});
	},

	onProjectAdded: function(project){
		var projectItemHtml = projectItemTemplate({project: project.toJSON()});
		if(project.get('type') == 1){
			this.$('.my-projects-none').remove();
			$(projectItemHtml).appendTo('.my-projects');
		}else{
			this.$('.other-projects-none').remove();
			$(projectItemHtml).appendTo('.other-projects');
		}
	},

	onProjectCollectionReset: function(collection){
		var that = this;
		collection.each(function(project){
			that.onProjectAdded(project);
		});
	},

	render: function(){
		this.$el.html(projectTemplate());
		return this;
	},
});