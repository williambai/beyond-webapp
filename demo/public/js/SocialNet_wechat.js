define(['router_wechat'],function(router){
	var SocialNet = function(){

		var initialize = function(){
			var appid = 'wx93534d55c06f6fec';//beyond_mp
			router.appid = appid;
			checkOpenId(appid,function(){
				checkLogin(runApplication);
			});
		};

		var checkOpenId = function(appid,callback){
			$.ajax('/wechat/check/openid?appid=' + appid,{
				mathod: 'GET',
				success: function(data){
					callback();
				},
				error: function(){
					window.location.href = '/wechat/oauth2?appid=' + appid;
				}
			});
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