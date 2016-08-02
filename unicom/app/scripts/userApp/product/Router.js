var Router = require('../_base/__Router');
var ProductHotsView = require('./views/ProductHots');
var ProductOrderView = require('./views/ProductOrder');
var ProductRecommendView = require('./views/ProductRecommend');

exports = module.exports = Router.extend({

	routes: {
		'product/hots': 'productHot',//** 热门产品
		'product/order/:id': 'productOrder',//** 产品订购
		'product/recommend/:id': 'productRecommend',//** 产品推荐
	},

	productHot: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand', '热门产品');
		var productHotView = new ProductHotsView({
			router: this,
			el: '#content',
		});
		this.changeView(productHotView);
		productHotView.trigger('load');
	},

	productOrder: function(id) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand', '产品订购');
		var productOrderView = new ProductOrderView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(productOrderView);
		productOrderView.trigger('load');
	},

	productRecommend: function(id) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand', '产品推荐');
		var productRecommendView = new ProductRecommendView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(productRecommendView);
		productRecommendView.trigger('load');
	},


});