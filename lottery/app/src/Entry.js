var $ = require('jquery'),
	Backbone = require('backbone'),
	router = new (require('./Router'))();
var config = require('./conf');

Backbone.$ = $;

exports = module.exports = function(){

	var checkLogin = function(callback){
		$.ajax(config.api.host + '/authenticated',{
			mathod: 'GET',
			success: function(account){
				if(account.code){
					return callback(false);
				}
				account.logined = 2;

				router.appEvents.trigger('logined',account);
				return callback(true);
			},
			error: function(){
				return callback(false);
			}
		});
	};

	/**
	 * for development ONLY
	 * @param  {Function} callback [description]
	 * @return {[type]}            [description]
	 */
	// checkLogin = function(callback){
	// 	var account = {
	// 		username: 'test',
	// 		email: 'test100@pdbang.cn',
	// 		avatar: '',
	// 		roles: {
	// 			admin: true,
	// 			agent: true,
	// 			user: true
	// 		}
	// 	};
	// 	router.appEvents.trigger('logined',account);
	// 	return callback(true);
	// };

	checkLogin(function(authenticated){
		if(!authenticated){
			window.location.hash = 'login';
		}else{
			// window.location.hash = 'index';
		}
		Backbone.history.start();
	});

};