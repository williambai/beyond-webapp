define(['router'],function(router){
	var Entry = function(){

		var initialize = function(){
			checkLogin(runApplication);
		};

		var checkLogin = function(callback){
			$.ajax('/authenticated',{
				mathod: 'GET',
				success: function(account){
					router.appEvents.trigger('logined',account);
					return callback(true);
				},
				error: function(){
					return callback(false);
				}
			});
		};

		var runApplication = function(authenticated){
			if(!authenticated){
				window.location.hash = 'login';
			}else{
				// window.location.hash = 'index';
			}
			Backbone.history.start();
		};
	
		return initialize;
	};

	return Entry;
});