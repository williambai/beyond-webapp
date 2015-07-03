define(['text!templates/projectWidget.html','text!templates/projectItem2.html','views/Projects','models/ProjectCollection'],
	function(projectTemplate,projectItemTemplate,ProjectListBaseView,ProjectCollection){
	var ProjectWidget = Backbone.View.extend({

		el: '#project-widget',

		template: _.template(projectTemplate),
		templateProjectItem: _.template(projectItemTemplate),

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
			var projectItemHtml = this.templateProjectItem({project: project.toJSON()});
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
			this.$el.html(this.template());
			return this;
		},
	});
	return ProjectWidget;
});