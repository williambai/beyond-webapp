var $ = require('jquery');
var Backbone = require('backbone');

var router = new (require('./Router'))();
var Socket = require('./Socket');

Backbone.$ = $;

exports = module.exports = function(){
	var checkLogin = function(callback){
			$.ajax('/authenticated',{
				mathod: 'GET',
				success: function(data){
					if(!!data.code)	return callback(false);
					router.appEvents.trigger('logined',data);
					router.socketEvents.trigger('app:logined',{accountId: data.id});
					return callback(true);
				},
				error: function(){
					return callback(false);
				}
			});
		};

	router.socket = new Socket({
			eventDispatcher:router.socketEvents
		});

	checkLogin(function(authenticated){
		if(!authenticated){
			window.location.hash = 'login';
		}else{
			// window.location.hash = 'index';
		}
		Backbone.history.start();
	});
};
