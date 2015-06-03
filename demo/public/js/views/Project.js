define(['text!templates/project.html','views/Status','models/Project','models/Status'],function(projectTemplate,StatusView,Project,Status){
	var ProjectView = Backbone.View.extend({
		el: '#content',
		template: _.template(projectTemplate),
		events: {
			'submit form': 'updateStatus'
		},
		
		initialize: function(options){
			this.pid = options.pid;
			// options.socketEvents.bind('status:me',this.onSocketStatusAdded, this);
			this.collection.on('add', this.onStatusAdded, this);
			this.collection.on('reset', this.onStatusCollectonReset, this);
		},

		onSocketStatusAdded: function(data){
			var newStatus = data.data;
			this.collection.add(new Status({status: newStatus.status, name: newStatus.name}));
		},

		onStatusCollectonReset: function(collection){
			var that = this;
			collection.each(function(model){
				that.onStatusAdded(model);
			});
		},

		onStatusAdded: function(status){
			var statusHtml = (new StatusView({model: status})).render().el;
			$(statusHtml).appendTo('.status_list').hide().fadeIn('slow');
		},

		updateStatus: function(){
			var statusCollection = this.collection;
			var statusText = $('input[name=text]').val();
			$.post('/projects/'+ this.pid +'/status',{text: statusText},function(data){
				// statusCollection.add(new Status({status: statusText,name:{first:'我'}}));
			});
			var statusModel = new Status({status:statusText,name: {first:'我'}});
			this.onStatusAdded(statusModel);
			return false;
		},

		render: function(){
			this.$el.html(this.template({model:{_id: this.pid, name: '待定'}}));
			return this;
		},
	});
	return ProjectView;
});