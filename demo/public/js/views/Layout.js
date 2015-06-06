define(['text!templates/loading.html','text!templates/layout.html','views/Projects'],function(loadingTemplate,layoutTemplate,ProjectsView){
	var LayoutView = Backbone.View.extend({
		el: 'body',
		template: _.template(layoutTemplate),
		loadingTemplate: _.template(loadingTemplate),

		loaded: false,		
		//.has-navbar-top.has-sidebar-left.sidebar-left-visible.sidebar-left-in.sidebar-left-visible
		initialize: function(options){
			this.socketEvents = options.socketEvents;
			this.chatSessions = options.chatSessions;
			this.currentChatView = options.currentChatView;

			this.$el
				.addClass('has-sidebar-left')
				.addClass('has-sidebar-right')
				// .addClass('sidebar-left-visible')
				// .addClass('sidebar-left-in')
				.addClass('has-navbar-top');
			this.on('set:brand', this.updateBrand,this);
			this.on('load', this.load,this);
		},

		events: {
			'click #left-sidebar-toggle': 'leftSideBarToggle',
			'click #right-sidebar-toggle': 'rightSideBarToggle',
		},

		load: function(){
			this.loaded = true;
			this.render();
			this.sidebarView = new ProjectsView({
				socketEvents: this.socketEvents,
				chatSessions: this.chatSessions,
				currentChatView: this.currentChatView
			});
			this.sidebarView.trigger('load');
			this.projectCollection = this.sidebarView.collection;
		},

		leftSideBarToggle: function(){
			var visible = this.$el.hasClass('sidebar-left-visible');
			if(!visible){
				this.$el
					.addClass('sidebar-left-in')
					.addClass('sidebar-left-visible');
			}else{
				this.$el
					.removeClass('sidebar-left-in')
					.removeClass('sidebar-left-visible');
			}
		},

		rightSideBarToggle: function(){
			var visible = this.$el.hasClass('sidebar-right-visible');
			if(!visible){
				this.$el
					.addClass('sidebar-right-in')
					.addClass('sidebar-right-visible');
			}else{
				this.$el
					.removeClass('sidebar-right-in')
					.removeClass('sidebar-right-visible');
			}
		},
		updateBrand: function(brand){
			this.$('.navbar-brand').text(brand || '');
		},

		render: function(){
			if(!this.loaded){
				this.$el.html(this.loadingTemplate);
			}else{
				this.$el.html(this.template());
			}
			return this;
		}
	});
	return LayoutView;
});