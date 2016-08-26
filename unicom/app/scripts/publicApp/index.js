//** entry
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
window.$ = $;
var config = require('./conf');

//** 应用级别的事件
var appEvents = _.extend({}, Backbone.Events);

var router = require('./router')(appEvents);

//** 路由入口
var entry = function(callback) {
	var search = window.location.search || '';
	if(/^\?/.test(search)) search = search.slice(1);
	var query = search.split('&') || [];
	var qs = {};
	query.forEach(function(param){
		var pairs = param.split('=') || [];
		if(pairs[1]) qs[pairs[0]] = decodeURIComponent(pairs[1]);
	});
	// console.log('qs: ' + JSON.stringify(qs));
	if(!qs.uid) return window.location.href = '50x.html';

	$.ajax({
		url: config.api.host + '/public/accounts/' + qs.uid,
		type: 'GET',
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true,
	}).done(function(data) {
		if (!(data && data._id)) {
			return window.location.href = '50x.html';
		}
		// console.log('data:' + JSON.stringify(data));
		appEvents.trigger('logined', {
			id: data._id,
			email: data.email,
		});
		if(qs.pid) window.location.hash = 'product/order/' + qs.pid;
		Backbone.history.start();
		return callback && callback();
	}).fail(function() {
		return window.location.href = '50x.html';
	});
};
entry();

