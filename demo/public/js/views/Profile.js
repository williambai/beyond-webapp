define(['text!templates/_layout.html','text!templates/profile.html','views/Status','models/Status'],
	function(layoutTemplate,profileTemplate,StatusView, Status){
	var ProfileView = Backbone.View.extend({
		el: $('#content'),
		layout: _.template(layoutTemplate),

		events: {
			'submit form': 'postStatus'
		},

		initialize: function(options){
			this.socketEvents = options.socketEvents;
			this.model.bind('change',this.render,this);
		},

		postStatus: function(){
			var that = this;
			var statusCollection = this.collection;
			var statusText = $('input[name=status]').val();
			$.post('/accounts/'+ this.model.get('_id') +'/status',{status: statusText},function(data){
			});
			var statusModel = new Status({status:statusText,name: {first:'我'}});
			that.prependStatus(statusModel);
			return false;
		},

		prependStatus: function(statusModel){
			var statusHtml = (new StatusView({model: statusModel})).render().el;
			$(statusHtml).prependTo('.status_list').hide().fadeIn('slow');
		},

		onSocketStatusAdded: function(data){
			var newStatus = data.data;
			this.prependStatus(new Status({
				status: newStatus.status,
				name: newStatus.name
			}));
		},

		render: function(){
			if(this.model.get('_id')){
				this.socketEvents.bind('status' + this.model.get('_id'), this.onSocketStatusAdded, this);
			}
			this.$el.html(this.layout({brand: '个人资料'}));
			this.$el.find('#main').html(_.template(profileTemplate)(this.model.toJSON()));
			var that = this;
			var statusCollection = this.model.get('status');
			if(null != statusCollection){
				_.each(statusCollection,function(statusJson){
					var statusModel = new Status(statusJson);
					that.prependStatus(statusModel);
				});
			}
			return this;
		}
	});
	return ProfileView;
});