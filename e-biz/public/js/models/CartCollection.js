define(['models/Cart'],function(Cart){
	var CartCollection = Backbone.Collection.extend({
		model: Cart,

	});

	return CartCollection;
});