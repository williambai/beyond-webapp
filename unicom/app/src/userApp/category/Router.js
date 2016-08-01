var Router = require('../_base/__Router');
var CategoryIndexView = require('./views/CategoryIndex');
var CategoryProductView = require('./views/CategoryProducts');

exports = module.exports = Router.extend({

	routes: {
		'category/index': 'categoryIndex',//** 产品分类
		'category/:cid/products': 'categoryProduct',//** 按分类查找产品
	},

	categoryIndex: function() {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand', '产品目录');
		var categoryIndexView = new CategoryIndexView({
			router: this,
			el: '#content'
		});
		this.changeView(categoryIndexView);
		categoryIndexView.trigger('load');
	},


	categoryProduct: function(id) {
		if (!this.logined) {
			window.location.hash = 'login';
			return;
		}
		//this.appEvents.trigger('set:brand', '全部产品');
		var categoryProductView = new CategoryProductView({
			router: this,
			el: '#content',
			id: id,
		});
		this.changeView(categoryProductView);
		categoryProductView.trigger('load');
	},

});