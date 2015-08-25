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
				if(account.errcode){
					return callback(false);
				}
				router.appEvents.trigger('logined',account);
				return callback(true);
			},
			error: function(){
				return callback(false);
			}
		});
	};

	checkLogin(function(authenticated){
		if(!authenticated){
			window.location.hash = 'login';
		}else{
			// window.location.hash = 'index';
		}
		Backbone.history.start();
	});

};