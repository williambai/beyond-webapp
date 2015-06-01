define(['router','SocialNetSocket'],function(router,SocialNetSocket){
	var SocialNet = function(){

		var initialize = function(){
			var socket = new SocialNetSocket({
				eventDispatcher:router.socketEvents,
				currentChatView: router.currentChatView,
				chatSessions: router.chatSessions,
			});
			socket.initialize();
			checkLogin(runApplication);
		};

		var checkLogin = function(callback){
			$.ajax('/account/authenticated',{
				mathod: 'GET',
				success: function(data){
					router.socketEvents.trigger('app:logined',data);
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
			}
			Backbone.history.start();
		};

		return {
			initialize: initialize
		};
	};

	return SocialNet;
});