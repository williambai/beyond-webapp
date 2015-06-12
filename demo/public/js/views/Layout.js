define(['text!templates/loading.html','text!templates/layout.html','views/Projects'],function(loadingTemplate,layoutTemplate,ProjectsView){
	var LayoutView = Backbone.View.extend({
		el: 'body',
		template: _.template(layoutTemplate),
		loadingTemplate: _.template(loadingTemplate),

		messageUnreadNum: 0, //未读消息数量
		// statusUnreadNum: 0, //好友圈新消息数量

		loaded: false,
		initialize: function(options){
			this.appEvents = options.appEvents;
			this.socketEvents = options.socketEvents;

			this.$el
				.addClass('has-sidebar-left')
				.addClass('has-sidebar-right')
				.addClass('has-navbar-top');
			this.appEvents.on('set:brand', this.updateBrand,this);
			this.socketEvents.on('chat:number:total', this.onMessageNumChanged, this);
			// this.socketEvents.on('status:number:unread', this.onStatusNumChanged, this);
			this.on('load', this.load,this);
		},

		events: {
			'click .list-group-item': 'activeItem',
			'click #left-sidebar-toggle': 'leftSideBarToggle',
			'click #right-sidebar-toggle': 'rightSideBarToggle',
			'click .sidebar-left': 'closeLeftSideBar',
			'click .sidebar-right': 'closeRightSideBar',
		},

		load: function(){
			this.loaded = true;
			this.render();
		},

		activeItem: function(evt){
			var currentItem = evt.currentTarget;
			this.$('.list-group-item').removeClass('active');
			this.$(currentItem).addClass('active');
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
			// return false;
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
			// return false;
		},

		closeLeftSideBar: function(){
			this.leftSideBarToggle();
		},

		closeRightSideBar: function(){
			this.rightSideBarToggle();
		},

		updateBrand: function(brand){
			this.$('.navbar-brand').text(brand || '');
		},

		onMessageNumChanged: function(num){
			this.messageUnreadNum += num;
			if(this.messageUnreadNum < 1) {
				this.messageUnreadNum = 0;
				this.$('.chat-total-unread').text('');
			}else{
				this.$('.chat-total-unread').text(this.messageUnreadNum);
			}
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