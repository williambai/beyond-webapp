define(['text!templates/projects.html','views/ProjectItem','views/ProjectChat','models/ChatCollection','models/ProjectCollection'],function(projectsTemplate,ProjectItemView,ChatView,ChatCollection,ProjectCollection){
	var ProjectsView = Backbone.View.extend({
		id: '#projectlist',
		template: _.template(projectsTemplate),

		initialize: function(options){
			this.socketEvents = options.socketEvents;
			this.currentChatView = options.currentChatView;
			this.chats = options.chats;
			
			this.collection = new ProjectCollection();
			this.collection.url = '/projects';
			this.collection.on('add', this.onProjectAdded, this);
			this.collection.on('reset', this.onProjectCollectionReset, this);
			this.on('load', this.load,this);
			this.socketEvents.on('app:projects:reload', this.load, this);
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
		// chats: {},
		startChatSession: function(model){
			if(null != this.currentChatView){
				this.currentChatView.undelegateEvents();
			}

			var roomId = model.get('accountId');
			if(!this.chats[roomId]){
				var chatCollection = new ChatCollection();
				var chatView = new ChatView({
						room: model,
						collection: chatCollection,
						socketEvents: this.socketEvents
					});
				chatView.render();
				chatCollection.url = '/chats/' + roomId;
				chatCollection.fetch();
				this.chats[roomId] = chatView;
			}else{
				var view = this.chats[roomId];
				view.delegateEvents();
				view.render();
				var collection = view.collection;
				collection.trigger('reset',collection);
			}

			this.currentChatView = this.chats[roomId];
		},

		render: function(){
			this.$el.html(this.template());
			return this;
		}
	});
	return ProjectsView;
});