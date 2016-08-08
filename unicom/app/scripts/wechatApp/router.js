//** routers
var Backbone = require('backbone');
var _ = require('underscore');
var config = require('../userApp/conf');

//** 应用级别的事件
var appEvents = _.extend({}, Backbone.Events);

//** 路由集合
new (require('../wechatApp/main/router'))({appEvents: appEvents});
new (require('../userApp/activity/Router'))({appEvents: appEvents});
new (require('../userApp/profile/Router'))({appEvents: appEvents});
new (require('../userApp/category/Router'))({appEvents: appEvents});
new (require('../userApp/customer/Router'))({appEvents: appEvents});
new (require('../userApp/feedback/Router'))({appEvents: appEvents});
new (require('../userApp/index/Router'))({appEvents: appEvents});
new (require('../userApp/me/Router'))({appEvents: appEvents});
new (require('../userApp/order/Router'))({appEvents: appEvents});
new (require('../userApp/phone/Router'))({appEvents: appEvents});
new (require('../userApp/product/Router'))({appEvents: appEvents});
new (require('../userApp/rank/Router'))({appEvents: appEvents});
// new (require('../userApp/salelead/Router'))({appEvents: appEvents});
new (require('../userApp/help/Router'))({appEvents: appEvents});

//** 路由入口
var checkLogin = function(callback) {
	$.ajax({
		url: config.api.host + '/login/check/' + config.app.nickname + '?appid=' + config.wechat.appid,
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
		appEvents.trigger('logined', data);
		return callback(true);
	}).fail(function(xhr) {
		// appEvents.trigger('logout');
		// console.log(xhr);
		// if(xhr.status == 302) return window.location.href = xhr.responseText;
		return callback(false);
	});
};

exports = module.exports = checkLogin;