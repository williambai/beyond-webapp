define([],function(){
	var Product = Backbone.Model.extend({
		urlRoot: '/products',
		defaults: {
			_id: '',
			name: '',
			description: '',
			main_cat_id: '',
		},
	});
	
	return Product;
});