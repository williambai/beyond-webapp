var Router = require('../base/Route');
var ProductHotsView = require('./views/ProductHots');
var ProductOrderView = require('./views/ProductOrder');

exports = module.exports = function(){

	var productHot = function() {
		if (!this.logined) {
			window.location.hash = 'notFound';
			return;
		}
		//this.appEvents.trigger('set:brand', '热门产品');
		var productHotView = new ProductHotsView({
			router: this,
			el: '#content',
		});
		this.appEvents.trigger('changeView',productHotView);
		productHotView.trigger('load');
	};

	var productOrder = function(id) {
		if (!this.logined) {
			window.location.hash = 'notFound';
			return;
		}
		//this.appEvents.trigger('set:brand', '产品订购');
		var productOrderView = new ProductOrderView({
			router: this,
			el: '#content',
			id: id,
		});
		this.appEvents.trigger('changeView',productOrderView);
		productOrderView.trigger('load');
	};

	var routesMap = {
		'product/hots': productHot,//** 热门产品
		'product/order/:id': productOrder,//** 产品订购
	};
	return routesMap;
};