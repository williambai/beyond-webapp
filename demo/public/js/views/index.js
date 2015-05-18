define(['text!templates/index.html'],function(indexTemplate){
	var IndexView = Backbone.View.extend({
		el: $('#content'),
		render: function(){
			this.$el.html(indexTemplate);
		},
	});
	return new IndexView;
});