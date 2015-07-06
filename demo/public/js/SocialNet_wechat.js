define(['router_wechat'],function(router){
	var SocialNet = function(){

		var initialize = function(originid){
			router.originid = originid;
			checkOpenId(originid,function(){
				checkLogin(runApplication);
			});
		};

		var checkOpenId = function(originid,callback){
			$.ajax('/wechat/check/openid?originid=' + originid,{
				mathod: 'GET',
				success: function(data){
					callback();
				},
				error: function(){
					window.location.href = '/wechat/oauth2?originid=' + originid;
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