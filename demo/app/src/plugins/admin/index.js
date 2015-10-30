var $ = require('jquery');
var Backbone = require('backbone');

var router = new(require('./Router'))();
var config = require('./conf');

Backbone.$ = $;
window.$ = $;

exports = module.exports = function() {

	var checkLogin = function(callback) {
		$.ajax({
			url: config.api.host + '/admin/authenticated',
			type: 'POST',
			xhrFields: {
				withCredentials: true
			},
			data: {
				email: 'admin@pdbang.cn',
				token: '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'
			},
			crossDomain: true,
		}).done(function(data) {
			if (!!data.code) return callback(false);
			router.appEvents.trigger('logined', data);
			router.socketEvents.trigger('app:logined', {
				accountId: data.id
			});
			return callback(true);
		}).fail(function() {
			return callback(false);
		});
		// var Model = Backbone.Model.extend({
		// 	url: config.api.host + '/authenticated'
		// });
		// var model = new Model();
		// model.fetch({
		// 	xhrFields: {
		// 		withCredentials: true
		// 	},
		// 	crossDomain: true,
		// 	success: function(data) {
		// 		if (!!data.code) return callback(false);
		// 		router.appEvents.trigger('logined', data);
		// 		router.socketEvents.trigger('app:logined', {
		// 			accountId: data.id
		// 		});
		// 		return callback(true);
		// 	},
		// 	error: function() {
		// 		return callback(false);
		// 	}
		// });
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