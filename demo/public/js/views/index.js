define(['text!templates/index.html'],function(indexTemplate){
	var IndexView = Backbone.View.extend({
		el: $('#content'),
		events: {
			'click .logout': 'logout',
		},
		logout: function(){
			$.get('/logout');
			window.location.hash = 'login';
			return false;
		},
		render: function(){
			this.$el.html(indexTemplate);
		},
	});
	return new IndexView;
});