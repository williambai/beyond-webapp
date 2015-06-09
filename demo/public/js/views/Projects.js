define(['text!templates/projects.html','views/ProjectItem','views/chatSession','models/ChatCollection','models/ProjectCollection'],function(projectsTemplate,ProjectItemView,ChatSessionView,ChatCollection,ProjectCollection){
	var ProjectsView = Backbone.View.extend({
		id: '#projectlist',
		template: _.template(projectsTemplate),

		initialize: function(options){
			this.socketEvents = options.socketEvents;
			this.currentChatView = options.currentChatView;
			this.chatSessions = options.chatSessions;
			
			this.collection = new ProjectCollection();
			this.collection.url = '/projects';
			this.collection.on('add', this.onProjectAdded, this);
			this.collection.on('reset', this.onProjectCollectionReset, this);
			this.on('load', this.load,this);
		},

		load: function(){
			this.collection.fetch({reset:true});
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
		// currentChatView: null,
		// chatSessions: {},
		startChatSession: function(model){
			if(null != this.currentChatView){
				this.currentChatView.undelegateEvents();
			}

			var roomId = model.get('accountId');
			if(!this.chatSessions[roomId]){
				var chatCollection = new ChatCollection();
				var chatSessionView = new ChatSessionView({
						room: model,
						collection: chatCollection,
						socketEvents: this.socketEvents
					});
				chatSessionView.render();
				chatCollection.url = '/chats/' + roomId;
				chatCollection.fetch();
				this.chatSessions[roomId] = chatSessionView;
			}else{
				var view = this.chatSessions[roomId];
				view.delegateEvents();
				view.render();
				var collection = view.collection;
				collection.trigger('reset',collection);
			}

			this.currentChatView = this.chatSessions[roomId];
		},

		render: function(){
			this.$el.html(this.template());
			return this;
		}
	});
	return ProjectsView;
});