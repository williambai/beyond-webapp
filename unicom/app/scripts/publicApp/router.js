//** routers
var Backbone = require('backbone');
var _ = require('underscore');
var config = require('./conf');
var Router = require('./base/Route');
//** 路由集合
var notFoundRouter = require('./404/router');
var categoryRouter = require('./category/router');
var productRouter = require('./product/router');

exports = module.exports = function(appEvents){

	var routesMap = {};
	routesMap = _.extend(routesMap, categoryRouter());
	routesMap = _.extend(routesMap, productRouter());
	routesMap = _.extend(routesMap, notFoundRouter());
	// console.log('routes: ' + JSON.stringify(_.keys(routesMap)));
	var MyRouter = Router.extend({
		routes: routesMap,
	});	
	var router =new MyRouter({appEvents:appEvents});


	//** controller 模式
	// var categoryController = require('./category/controller')(router);
	// router.routes = {
	// 	'': categoryController.index,
	// 	'category/index': categoryController.index,//** 产品分类
	// 	// 'category/:cid/products': categoryController.categoryProduct,//** 按分类查找产品
	// };

	return router;
}
