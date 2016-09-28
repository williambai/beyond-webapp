requirejs.config({
	baseUrl: 'scripts',
	shim: {
		'bootstrap': {
			'deps': ['jquery'],
		}
	},
	paths: {
		'jquery': '/assets/js/jquery',
		'bootstrap':'/assets/js/bootstrap',
		'underscore': '/assets/js/underscore',
		'backbone': '/assets/js/backbone',
		'text': '/assets/js/text',
	}

});

require([
		'jquery'
		,'underscore'
		,'bootstrap'
		,'backbone'
		,'./config'
		,'./router'
	], function(
		$
		,_ 
		,bootstrap
		,Backbone
		,global
		,context
	){
		context = _.extend(context,global);
		// (function(callback) {
		// 	$.ajax({
		// 		url: config.api.host + '/api/login/check/' + config.app.nickname,
		// 		type: 'GET',
		// 		xhrFields: {
		// 			withCredentials: true
		// 		},
		// 		crossDomain: true,
		// 	}).done(function(data) {
		// 		if (!!data.code) return Backbone.history.start();
		// 		appEvents.trigger('logined', data);
		// 		return Backbone.history.start();
		// 	}).fail(function() {
		// 		window.location.hash = 'login';
		// 		return Backbone.history.start();
		// 	});
		// })();
		context.trigger('logined');
		Backbone.history.start();
});