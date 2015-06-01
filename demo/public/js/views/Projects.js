define(['text!templates/projects.html','views/ProjectItem','views/chatSession','models/ChatCollection'],function(projectsTemplate,ProjectItemView,ChatSessionView,ChatCollection){
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
			var roomId = model.get('_id');
			if(!this.chatSessions[roomId]){
				var chatCollection = new ChatCollection();
				chatCollection.url = '/chats/' + roomId;
				var chatSessionView = new ChatSessionView({
						room: model,
						collection: chatCollection,
						socketEvents: this.socketEvents
					});
				chatSessionView.render();
				chatCollection.fetch();
				// this.$el.prepend(chatSessionView.render().el);
				this.chatSessions[roomId] = chatSessionView;
			}else{
				this.chatSessions[roomId].render(roomId);
			}
		},

		render: function(){
			this.$el.html(this.template());
			return this;
		}
	});
	return ProjectsView;
});