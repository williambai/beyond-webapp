//** routers
var config = require('../userApp/conf');

var main = new (require('../wechatApp/main/router'));
new (require('../userApp/activity/Router'))({appEvents: main.appEvents});
new (require('../userApp/profile/Router'))({appEvents: main.appEvents});
new (require('../userApp/category/Router'))({appEvents: main.appEvents});
new (require('../userApp/customer/Router'))({appEvents: main.appEvents});
new (require('../userApp/feedback/Router'))({appEvents: main.appEvents});
new (require('../userApp/index/Router'))({appEvents: main.appEvents});
new (require('../userApp/me/Router'))({appEvents: main.appEvents});
new (require('../userApp/order/Router'))({appEvents: main.appEvents});
new (require('../userApp/phone/Router'))({appEvents: main.appEvents});
new (require('../userApp/product/Router'))({appEvents: main.appEvents});
new (require('../userApp/rank/Router'))({appEvents: main.appEvents});
// new (require('../userApp/salelead/Router'))({appEvents: main.appEvents});
new (require('../userApp/help/Router'))({appEvents: main.appEvents});

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
		main.appEvents.trigger('logined', data);
		return callback(true);
	}).fail(function(xhr) {
		// main.appEvents.trigger('logout');
		// console.log(xhr);
		// if(xhr.status == 302) return window.location.href = xhr.responseText;
		return callback(false);
	});
};

exports = module.exports = checkLogin;