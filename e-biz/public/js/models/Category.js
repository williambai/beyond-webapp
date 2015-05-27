define([],function(){
	var Category = Backbone.Model.extend({
		urlRoot: '/categories',
		defaults: {
			_id: '',
			parent: '',
			name: '',
			description: ''
		}
	});
	return Category;
});