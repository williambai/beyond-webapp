define(['router_wechat'],function(router){
	var SocialNet = function(){

		var initialize = function(){
			checkLogin(runApplication);
		};

		var checkLogin = function(callback){
			$.ajax('/account/authenticated',{
				mathod: 'GET',
				success: function(data){
					router.appEvents.trigger('logined',data);
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

		return {
			initialize: initialize
		};
	};

	return SocialNet;
});