define([],function(){
	var Category = Backbone.Model.extend({
		urlRoot: '/categories',
		defaults: {
			_id: '',
			name: '',
			description: ''
		}
	});
	return Category;
});