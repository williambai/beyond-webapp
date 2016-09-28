define(['./views/index','./views/city','./views/search'],function(IndexView,CityView,SearchView){
	return Backbone.Router.extend({

 		initialize: function(options){
 			this.context = options;
 		},

		routes: {
			'spot/index': 'indexView',
			'spot/search': 'searchView',
			'address/city': 'cityView',
		},

		indexView: function(){
			if(!(this.context && this.context.logined)){
				window.location.hash = 'login';
				return;
			}
			var indexView = new IndexView({
				context: this.context,
				el: '#content',
			});
			this.context.trigger('changeView',indexView);
			indexView.trigger('load');
		},	

		cityView: function(){
			if(!(this.context && this.context.logined)){
				window.location.hash = 'login';
				return;
			}
			var cityView = new CityView({
				context: this.context,
				el: '#content',
			});
			this.context.trigger('changeView',cityView);
			cityView.trigger('load');
		},	

		searchView: function(){
			if(!(this.context && this.context.logined)){
				window.location.hash = 'login';
				return;
			}
			var searchView = new SearchView({
				context: this.context,
				el: '#content',
			});
			this.context.trigger('changeView',searchView);
			searchView.trigger('load');
		},	

	});
});