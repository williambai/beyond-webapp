define([
		'base/router'
		,'spot/router'
	], function(
		Base
		,Spot
	){

    var context = new Base();

	//** 路由集合
    new Spot(context);

    return context;
});
