define(['views/Status','text!templates/profile.html','models/Status'],
	function(StatusView, profileTemplate,Status){
	var ProfileView = Backbone.View.extend({
		el: $('#content'),

		initialize: function(){
			this.model.bind('change',this.render,this);
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