define(['./views/list','./views/edit'],function(ListView,EditView){
	return Backbone.Router.extend({

 		initialize: function(options){
 			this.context = options;
 		},

		routes: {
			'spot/index': 'listView',
			'spot/add': 'editView',
			'spot/edit/:id': 'editView'
		},

		listView: function(){
			if(!(this.context && this.context.logined)){
				window.location.hash = 'login';
				return;
			}
			var listView = new ListView({
				context: this.context,
				el: '#content',
			});
			this.context.trigger('changeView',listView);
			listView.trigger('load');
		},	

		editView: function(id){
			if(!(this.context && this.context.logined)){
				window.location.hash = 'login';
				return;
			}
			var editView = new EditView({
				context: this.context,
				el: '#content',
				id: id,
			});
			this.context.trigger('changeView',editView);
			editView.trigger('load');
		},	

	});
});