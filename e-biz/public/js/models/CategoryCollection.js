define(['models/Category'],function(Category){
	var CategoryCollection = Backbone.Collection.extend({
		model: Category,

	});

	return CategoryCollection;
});