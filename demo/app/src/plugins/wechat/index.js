var $ = require('jquery');
var Backbone = require('backbone');

var router = new(require('./Router'))();
var config = require('./conf');
Backbone.$ = $;

exports = module.exports = function() {

	var checkLogin = function(callback) {
		$.ajax({
			url: config.api.host + '/account/authenticated',
			type: 'GET',
			xhrFields: {
				withCredentials: true
			},
		}).done(function(data) {
			router.appEvents.trigger('logined', data);
			return callback(true);
		}).fail(function() {
			return callback(false);
		});
	};

	var checkOpenId = function(originid, callback) {
		$.ajax({
			url: config.api.host + '/wechat/check/openid?originid=' + originid,
			type: 'GET',
			xhrFields: {
				withCredentials: true
			},
		}).done(function(data) {
			callback();
		}).fail(function() {
			window.location.href = '/wechat/oauth2?originid=' + originid;
		});
	};

	router.originid = originid;

	checkOpenId(originid, function() {
		checkLogin(function(authenticated) {
			if (!authenticated) {
				window.location.hash = 'login';
			} else {
				// window.location.hash = 'index';
			}
			Backbone.history.start();
		});
	});
};