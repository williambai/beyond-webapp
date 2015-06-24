define(['text!templates/projects_wechat.html','views/ProjectItem_wechat','models/ProjectCollection'],function(projectsTemplate,ProjectItemView,ProjectCollection){
	var ProjectsView = Backbone.View.extend({
		el: '#content',
		template: _.template(projectsTemplate),

		initialize: function(options){
			this.socketEvents = options.socketEvents;
			this.currentChatView = options.currentChatView;
			this.chats = options.chats;
			
			this.collection = new ProjectCollection();
			this.collection.url = '/accounts/me/projects';
			this.collection.on('add', this.onProjectAdded, this);
			this.collection.on('reset', this.onProjectCollectionReset, this);
			this.on('load', this.load,this);
		},

		load: function(){
			this.render();
			this.collection.fetch({reset:true});
		},

		onProjectAdded: function(project){
			var projectItemView = new ProjectItemView({model: project,socketEvents: this.socketEvents});
			var projectItemHtml = projectItemView.render().el;
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
		}
	});
	return ProjectsView;
});