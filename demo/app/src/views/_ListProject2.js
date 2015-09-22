var _ = require('underscore');
var ProjectItemView = require('./_ItemProject'),
    ListView = require('./__ListView'),
    ProjectCollection = require('../models/ProjectCollection');

exports = module.exports = ListView.extend({

	el: '#project-widget',

	initialize: function(options){
		this.socketEvents = options.socketEvents;
		this.collection = new ProjectCollection();
		this.collection.url = '/projects/account/me';
		ListView.prototype.initialize.apply(this,options);
	},

	getNewItemView: function(model){
		return new ProjectItemView({socketEvents: this.socketEvents,model: model});
	},

	// onProjectAdded: function(project){
	// 	var projectItemHtml = projectItemTemplate({project: project.toJSON()});
	// 	if(project.get('type') == 1){
	// 		this.$('.my-projects-none').remove();
	// 		$(projectItemHtml).appendTo('.my-projects');
	// 	}else{
	// 		this.$('.other-projects-none').remove();
	// 		$(projectItemHtml).appendTo('.other-projects');
	// 	}
	// },

	// onProjectCollectionReset: function(collection){
	// 	var that = this;
	// 	collection.each(function(project){
	// 		that.onProjectAdded(project);
	// 	});
	// },
});