define(['text!templates/projects.html','views/ProjectItem'],function(projectsTemplate,ProjectItemView){
	var ProjectsView = Backbone.View.extend({
		el: $('#projectlist'),
		template: _.template(projectsTemplate),

		initialize: function(options){
			this.socketEvents = options.socketEvents;
			this.collection.on('add', this.projectAdded, this);
			this.collection.on('reset', this.projectCollectionReset, this);
		},

		projectAdded: function(project){
			var projectItemHtml = (new ProjectItemView({model: project,socketEvents: this.socketEvents})).render().el;
			$(projectItemHtml).appendTo('#projectlist').hide().fadeIn('slow');
		},

		projectCollectionReset: function(collection){
			var that = this;
			this.$el.html('');
			collection.each(function(project){
				that.projectAdded(project);
			});
		},

		render: function(){
			this.$el.html(this.template());
			return this;
		}
	});
	return ProjectsView;
});