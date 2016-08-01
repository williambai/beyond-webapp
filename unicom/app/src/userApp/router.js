//** routers
var config = require('./conf');

var signup = new (require('./signup/router'));
new (require('./activity/Router'))({appEvents: signup.appEvents});
new (require('./profile/Router'))({appEvents: signup.appEvents});
new (require('./category/Router'))({appEvents: signup.appEvents});
new (require('./customer/Router'))({appEvents: signup.appEvents});
new (require('./feedback/Router'))({appEvents: signup.appEvents});
new (require('./index/Router'))({appEvents: signup.appEvents});
new (require('./me/Router'))({appEvents: signup.appEvents});
new (require('./order/Router'))({appEvents: signup.appEvents});
new (require('./phone/Router'))({appEvents: signup.appEvents});
new (require('./product/Router'))({appEvents: signup.appEvents});
new (require('./rank/Router'))({appEvents: signup.appEvents});
// new (require('./salelead/Router'))({appEvents: signup.appEvents});
new (require('./help/Router'))({appEvents: signup.appEvents});


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
		signup.appEvents.trigger('logined', data);
		return callback(true);
	}).fail(function() {
		signup.appEvents.trigger('logout');
		return callback(false);
	});
};
exports = module.exports = checkLogin;