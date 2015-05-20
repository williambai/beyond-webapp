define(['views/Status','text!templates/profile.html','models/Status'],
	function(StatusView, profileTemplate,Status){
	var ProfileView = Backbone.View.extend({
		el: $('#content'),

		events: {
			'submit form': 'postStatus'
		},

		initialize: function(){
			this.model.bind('change',this.render,this);
		},

		postStatus: function(){
			var that = this;
			var statusCollection = this.collection;
			var statusText = $('input[name=status]').val();
			$.post('/accounts/'+ this.model.get('_id') +'/status',{status: statusText},function(data){
				var statusModel = new Status({status:statusText,name: {first:'我'}});
				that.prependStatus(statusModel);
			});
			return false;
		},

		prependStatus: function(statusModel){
			var statusHtml = (new StatusView({model: statusModel})).render().el;
			$(statusHtml).prependTo('.status_list').hide().fadeIn('slow');
		},

		render: function(){
			this.$el.html(_.template(profileTemplate)(this.model.toJSON()));

			var statusCollection = this.model.get('status');
			if(null != statusCollection){
				_.each(statusCollection,function(statusJson){
					var statusModel = new Status(statusJson);
					var statusHtml = (new StatusView({model: statusModel})).render().el;
					$(statusHtml).prependTo('.status_list').hide().fadeIn('slow');
				});
			}
			return this;
		}
	});
	return ProfileView;
});