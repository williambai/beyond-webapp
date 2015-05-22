define(['text!templates/index.html','views/Status','models/Status'],
	function(indexTemplate,StatusView,Status){
	var IndexView = Backbone.View.extend({
		el: $('#content'),
		events: {
			'click .logout': 'logout',
			'submit form': 'updateStatus'
		},
		
		initialize: function(options){
			options.socketEvents.bind('status:me',this.onSocketStatusAdded, this);
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
			$(statusHtml).prependTo('.status_list').hide().fadeIn('slow');
		},

		logout: function(){
			$.get('/logout');
			window.location.hash = 'login';
			return false;
		},

		updateStatus: function(){
			var statusCollection = this.collection;
			var statusText = $('input[name=status]').val();
			$.post('/accounts/me/status',{status: statusText},function(data){
				statusCollection.add(new Status({status: statusText,name:{first:'我'}}));
			});
			return false;
		},

		render: function(){
			this.$el.html(indexTemplate);
			return this;
		},
	});
	return IndexView;
});