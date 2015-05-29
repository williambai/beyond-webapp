define(['text!templates/projects.html','views/ProjectItem','views/chatSession'],function(projectsTemplate,ProjectItemView,ChatSessionView){
	var ProjectsView = Backbone.View.extend({
		el: $('#projectlist'),
		template: _.template(projectsTemplate),

		initialize: function(options){
			this.socketEvents = options.socketEvents;
			this.collection.on('add', this.onProjectAdded, this);
			this.collection.on('reset', this.onProjectCollectionReset, this);
		},

		onProjectAdded: function(project){
			var projectItemView = new ProjectItemView({model: project,socketEvents: this.socketEvents});
			projectItemView.bind('chat:start', this.startChatSession, this);
			var projectItemHtml = projectItemView.render().el;
			$(projectItemHtml).appendTo('#projectlist');
		},

		onProjectCollectionReset: function(collection){
			var that = this;
			this.$el.html('');
			collection.each(function(project){
				that.onProjectAdded(project);
			});
		},

		chatSessions: {},
		startChatSession: function(model){
			var accountId = model.get('accountId');
			if(!this.chatSessions[accountId]){
				var chatSessionView = new ChatSessionView({
					model: model,
					socketEvents: this.socketEvents
				});
				chatSessionView.render();
				// this.$el.prepend(chatSessionView.render().el);
				this.chatSessions[accountId] = chatSessionView;
			}else{
				this.chatSessions[accountId].render();
			}
		},

		render: function(){
			this.$el.html(this.template());
			return this;
		}
	});
	return ProjectsView;
});