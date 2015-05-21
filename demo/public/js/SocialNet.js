define(['router','SocialNetSocket'],function(router,socket){
	var initialize = function(){
		socket.initialize(router.socketEvents);
		checkLogin(runApplication);
	};

	var checkLogin = function(callback){
		$.ajax('/account/authenticated',{
			mathod: 'GET',
			success: function(){
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
			window.location.hash = 'index';
			router.socketEvents.trigger('app:logined');
		}
		Backbone.history.start();
	}

	return {
		initialize: initialize
	};
});