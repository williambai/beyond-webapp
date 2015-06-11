define(['text!templates/projectAdd.html'],function(projectAddTemplate){
	var AddProjectView = Backbone.View.extend({
		el: '#content',
		template: _.template(projectAddTemplate),

		events: {
			'submit form': 'addProject'
		},

		initialize: function(options){
			this.socketEvents = options.socketEvents;
		},

		addProject: function(){
			var name = $('input[name=name]').val();
			var description = $('textarea[name=description]').val();
			if(name.length<2){
				console.log('name too short.');
				return false;
			}
			var that = this;
			$.post('/projects',{
				name: name,
				description: description 
			},function success(){
				that.socketEvents.trigger('app:projects:reload');
			});
			window.location.hash = 'contact/add';
			return false;
		},

		render: function(){
			this.$el.html(this.template());
			return this;
		}
	});
	return AddProjectView;
});