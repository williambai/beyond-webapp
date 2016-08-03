//** routers
var config = require('./conf');

var main = new (require('./main/router'));
new (require('./activity/Router'))({appEvents: main.appEvents});
new (require('./profile/Router'))({appEvents: main.appEvents});
new (require('./category/Router'))({appEvents: main.appEvents});
new (require('./customer/Router'))({appEvents: main.appEvents});
new (require('./feedback/Router'))({appEvents: main.appEvents});
new (require('./index/Router'))({appEvents: main.appEvents});
new (require('./me/Router'))({appEvents: main.appEvents});
new (require('./order/Router'))({appEvents: main.appEvents});
new (require('./phone/Router'))({appEvents: main.appEvents});
new (require('./product/Router'))({appEvents: main.appEvents});
new (require('./rank/Router'))({appEvents: main.appEvents});
// new (require('./salelead/Router'))({appEvents: main.appEvents});
new (require('./help/Router'))({appEvents: main.appEvents});


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
		main.appEvents.trigger('logined', data);
		return callback(true);
	}).fail(function() {
		window.location.hash = 'login';
		return callback(false);
	});
};
exports = module.exports = checkLogin;