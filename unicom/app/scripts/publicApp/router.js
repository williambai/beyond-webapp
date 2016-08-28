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

	var router =new Router({
			routes:routesMap,
			appEvents:appEvents
		});
	// console.log('routes: ' + JSON.stringify(_.keys(router.routes)));
	return router;
}
