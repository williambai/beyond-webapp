define([],function(){
	var Category = Backbone.Model.extend({
		urlRoot: '/categories'
	});
	return Category;
});