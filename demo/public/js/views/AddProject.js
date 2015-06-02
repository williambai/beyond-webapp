define(['text!templates/addProject.html'],function(addProjectTemplate){
	var AddProjectView = Backbone.View.extend({
		el: $('#content'),
		template: _.template(addProjectTemplate),

		events: {
			'submit form': 'addProject'
		},

		initialize: function(options){
			this.projectCollection = options.projectCollection;
		},

		addProject: function(){
			var that = this;
			$.post('/projects',{
				name: $('input[name=name]').val(),
				description: $('input[name=description]').val()
			},function success(){
				that.projectCollection.fetch({reset: true});
			});
			window.location.hash = 'addcontact';
			return false;
		},

		render: function(){
			this.$el.html(this.template());
			return this;
		}
	});
	return AddProjectView;
});