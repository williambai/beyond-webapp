define(['models/Product'],function(Product){
	var ProductCollection = Backbone.Collection.extend({
		model: Product,

	});

	return ProductCollection;
});