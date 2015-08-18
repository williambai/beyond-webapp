define([],function(){

	var Person = Backbone.Model.extend({

		defaults: {
			card_id: '',
			card_name: '',
			content: {
				rts: []
			},
		},
	});
	
	return Person;
});