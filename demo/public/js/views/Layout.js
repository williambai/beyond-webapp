define(['text!templates/layout.html'],function(layoutTemplate){
	var LayoutView = Backbone.View.extend({
		el: 'body',
		template: _.template(layoutTemplate),
		//.has-navbar-top.has-sidebar-left.sidebar-left-visible.sidebar-left-in.sidebar-left-visible
		initialize: function(){
			this.$el
				.addClass('has-sidebar-left')
				.addClass('has-sidebar-right')
				// .addClass('sidebar-left-visible')
				// .addClass('sidebar-left-in')
				.addClass('has-navbar-top')
		},

		events: {
			'click #left-sidebar-toggle': 'leftSideBarToggle',
			'click #right-sidebar-toggle': 'rightSideBarToggle',
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

		render: function(){
			this.$el.html(this.template());
			return this;
		}
	});
	return LayoutView;
});