//** routers
var config = require('../userApp/conf');

var signup = new (require('../userApp/signup/router'));
new (require('../userApp/activity/Router'))({appEvents: signup.appEvents});
new (require('../userApp/profile/Router'))({appEvents: signup.appEvents});
new (require('../userApp/category/Router'))({appEvents: signup.appEvents});
new (require('../userApp/customer/Router'))({appEvents: signup.appEvents});
new (require('../userApp/feedback/Router'))({appEvents: signup.appEvents});
new (require('../userApp/index/Router'))({appEvents: signup.appEvents});
new (require('../userApp/me/Router'))({appEvents: signup.appEvents});
new (require('../userApp/order/Router'))({appEvents: signup.appEvents});
new (require('../userApp/phone/Router'))({appEvents: signup.appEvents});
new (require('../userApp/product/Router'))({appEvents: signup.appEvents});
new (require('../userApp/rank/Router'))({appEvents: signup.appEvents});
// new (require('../userApp/salelead/Router'))({appEvents: signup.appEvents});
new (require('../userApp/help/Router'))({appEvents: signup.appEvents});

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
		signup.appEvents.trigger('logined', data);
		return callback(true);
	}).fail(function(xhr) {
		// signup.appEvents.trigger('logout');
		// console.log(xhr);
		// if(xhr.status == 302) return window.location.href = xhr.responseText;
		return callback(false);
	});
};

exports = module.exports = checkLogin;