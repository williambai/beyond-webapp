define(['text!templates/_layout.html','text!templates/addProject.html'],function(layoutTemplate,addProjectTemplate){
	var AddProjectView = Backbone.View.extend({
		el: $('#content'),
		layout: _.template(layoutTemplate),
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
			this.$el.html(this.layout({brand: '新建项目'}));
			this.$el.find('#main').html(this.template());
			return this;
		}
	});
	return AddProjectView;
});