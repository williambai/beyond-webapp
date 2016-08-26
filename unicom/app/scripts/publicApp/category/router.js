var CategoryIndexView = require('./views/CategoryIndex');
var CategoryProductView = require('./views/CategoryProducts');

exports = module.exports = function(){

	var categoryIndex = function() {
			if (!this.logined) {
				window.location.hash = 'notFound';
				return;
			}
			//this.appEvents.trigger('set:brand', '产品目录');
			var categoryIndexView = new CategoryIndexView({
				router: this,
				el: '#content'
			});
			this.changeView(categoryIndexView);
			categoryIndexView.trigger('load');
		};

	var categoryProduct = function(id) {
			if (!this.logined) {
				window.location.hash = 'notFound';
				return;
			}
			//this.appEvents.trigger('set:brand', '全部产品');
			var categoryProductView = new CategoryProductView({
				router: this,
				el: '#content',
				id: id,
			});
			this.appEvents.trigger('changeView',categoryProductView);
			categoryProductView.trigger('load');
		};

	var routesMap = {
		'': categoryIndex,
		'category/index': categoryIndex,//** 产品分类
		'category/:cid/products': categoryProduct,//** 按分类查找产品
	};

	return routesMap;
};