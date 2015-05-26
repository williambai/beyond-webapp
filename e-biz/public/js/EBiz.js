define(['router'],function(router){
	var EBiz = function(){

		var initialize = function(){
			Backbone.history.start();
		};
		
		return {
			initialize: initialize
		}
	};

	return EBiz;
});