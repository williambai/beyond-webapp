define(['text!templates/_itemProject_wechat.html'],function(projectItemTemplate){
	var ProjectItemView = Backbone.View.extend({
		tagName: 'div',
		template: _.template(projectItemTemplate),

		events: {
		},

		initialize: function(options){
		},


		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
	});
	return ProjectItemView;
});