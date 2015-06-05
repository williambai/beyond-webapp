define(['text!templates/loading.html','text!templates/statuses.html','views/Status','models/Status','models/StatusCollection'],
	function(loadingTemplate,statusesTemplate,StatusView,Status,StatusCollection){
	var StatusesView = Backbone.View.extend({
		el: '#content',
		template: _.template(statusesTemplate),

		loaded: false,
		loadingTemplate: _.template(loadingTemplate),

		events: {
			'click .editor-toggle': 'editorToggle',
			'submit form': 'updateStatus'
		},
		
		initialize: function(options){
			this.accountId = options.id;
			// options.socketEvents.bind('status:me',this.onSocketStatusAdded, this);

			this.collection = new StatusCollection();
			if(options.activity){
				this.collection.url = '/accounts/'+ options.id + '/activity';
			}else{
				this.collection.url = '/accounts/'+ options.id + '/status';
			}
			this.collection.on('add', this.onStatusAdded, this);
			this.collection.on('reset', this.onStatusCollectonReset, this);
			this.on('load', this.load, this);
		},

		load: function(){
			this.loaded = true;
			this.render();
			this.collection.fetch();
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
			$(statusHtml).appendTo('.status-list').hide().fadeIn('slow');
		},

		editorToggle: function(){
			if(this.$('.status-editor').hasClass('hidden')){
				this.$('.status-editor').removeClass('hidden').hide().fadeIn('slow');
			}else{
				this.$('.status-editor').addClass('hidden').hide().fadeOut('slow');
			}
		},

		updateStatus: function(){
			var statusCollection = this.collection;
			var statusText = $('textarea[name=text]').val();
			$.post('/accounts/'+ this.accountId +'/status',{status: statusText},function(data){
				// statusCollection.add(new Status({status: statusText,name:{first:'我'}}));
			});
			// var statusModel = new Status({status:statusText,name: {first:'我'}});
			// this.onStatusAdded(statusModel);
			$('textarea[name=text]').val('');
			this.$('.status-editor').addClass('hidden').hide().fadeOut('slow');
			return false;
		},

		render: function(){
			if(!this.loaded){
				this.$el.html(this.loadingTemplate);
			}else{
				this.$el.html(this.template());
			}
			return this;
		},
	});
	return StatusesView;
});