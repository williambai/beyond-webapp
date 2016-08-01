var $ = require('jquery');
var Backbone = require('backbone');

var router = new(require('./Router'))();
var config = require('./conf');

Backbone.$ = $;
window.$ = $;

exports = module.exports = function() {

	var checkLogin = function(callback) {
		$.ajax({
			url: config.api.host + '/login/check/' + router.appCode + '?appid=' + config.wechat.appid,
			type: 'GET',
			xhrFields: {
				withCredentials: true
			},
			crossDomain: true,
		}).done(function(data) {
			if (data.code) {
				if( data.code == 30200) return window.location.href = data.redirect;
				return callback(false);
			}
			router.appEvents.trigger('logined', data);
			return callback(true);
		}).fail(function(xhr) {
			// console.log(xhr);
			// if(xhr.status == 302) return window.location.href = xhr.responseText;
			return callback(false);
		});
	};

	checkLogin(function(authenticated) {
		if (!authenticated) {
			window.location.hash = 'login';
		} else {
			// window.location.hash = 'index';
		}
		Backbone.history.start();
	});
};