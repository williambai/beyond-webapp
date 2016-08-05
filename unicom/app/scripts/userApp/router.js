//** routers
var Backbone = require('backbone');
var _ = require('underscore');
var config = require('./conf');

//** 应用级别的事件
var appEvents = _.extend({}, Backbone.Events);

//** 路由集合
new (require('./main/router'))({appEvents: appEvents});
new (require('./activity/Router'))({appEvents: appEvents});
new (require('./profile/Router'))({appEvents: appEvents});
new (require('./category/Router'))({appEvents: appEvents});
new (require('./customer/Router'))({appEvents: appEvents});
new (require('./feedback/Router'))({appEvents: appEvents});
new (require('./index/Router'))({appEvents: appEvents});
new (require('./me/Router'))({appEvents: appEvents});
new (require('./order/Router'))({appEvents: appEvents});
new (require('./phone/Router'))({appEvents: appEvents});
new (require('./product/Router'))({appEvents: appEvents});
new (require('./rank/Router'))({appEvents: appEvents});
// new (require('./salelead/Router'))({appEvents: appEvents});
new (require('./help/Router'))({appEvents: appEvents});

//** 路由入口
var checkLogin = function(callback) {
	$.ajax({
		url: config.api.host + '/login/check/' + config.app.nickname,
		type: 'GET',
		xhrFields: {
			withCredentials: true
		},
		crossDomain: true,
	}).done(function(data) {
		if (!!data.code) return callback(false);
		appEvents.trigger('logined', data);
		return callback(true);
	}).fail(function() {
		window.location.hash = 'login';
		return callback(false);
	});
};
exports = module.exports = checkLogin;