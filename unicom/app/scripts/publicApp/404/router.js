var NotFoundView = require('./views/NotFound');

exports = module.exports = function(){

	var innerError = function(){
		window.location.href = '50x.html';
	};

	var notFound = function() {
		if (!this.logined) {
			window.location.hash = 'notFound';
			return;
		}
		var notFoundView = new NotFoundView({
			router: this,
			el: '#content'
		});
		this.changeView(notFoundView);
		notFoundView.trigger('load');
	};

	var routesMap = {
		'innerError': innerError,
		'notFound': notFound,
	};
	return routesMap;
};