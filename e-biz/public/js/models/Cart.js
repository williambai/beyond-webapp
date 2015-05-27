define([],function(){
	var Cart = Backbone.Model.extend({
		urlRoot: '/cart',
		defaults: {
			_id: '',
			name: '',
			description: '',
			main_cat_id: '',
		},
	});
	
	return Cart;
});