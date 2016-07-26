var regexp = require('../libs/regexp');

exports = module.exports = function(app, models) {

 	// var getOne = function(req, res) {
 	// 	var id = req.params.id;
 	// 	models.PlatformStatsCity
 	// 		.findById(id)
 	// 		.exec(function(err, doc) {
 	// 			if (err) return res.send(err);
 	// 			res.send(doc);
 	// 		});
 	// };

 	var getMore = function(req, res) {
 		var action = req.query.action || '';
 		// var per = 20;
 		// var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
 		// page = (!page || page < 0) ? 0 : page;

 		switch (action) {
 			case 'account':
	 			var city = req.query.city;
	 			var district = req.query.district;
	 			var grid = req.query.grid;
	 			if(city && district && grid){
	 				models.Account
	 					.statByGrid({
	 						city: city,
	 						district: district,
	 						grid: grid,
	 					},function(err,docs){
	 						if(err) return res.send(err);
	 						res.send(docs);
	 					});
	 			}else if(city && district){
	 				models.Account
	 					.statByGrid({
	 						city: city,
	 						district: district,
	 					},function(err,docs){
	 						if(err) return res.send(err);
	 						res.send(docs);
	 					});
	 			}else if(city){
	 				models.Account
	 					.statByDistrict({
	 						city: city,
	 					},function(err,docs){
	 						if(err) return res.send(err);
	 						res.send(docs);
	 					});
	 			}else{
	 				models.Account
	 					.statByCity({},function(err,docs){
	 						if(err) return res.send(err);
	 						res.send(docs);
	 					});
	 			}
	 			break;	
 			case 'order':
	 			//** 查询起始时间
	 			var from = new Date(req.query.from || 0);
	 			//** 查询结束时间
	 			var to = new Date(req.query.to || Date.now());
	 			var city = req.query.city;
	 			var district = req.query.district;
	 			to = new Date(to.getTime() + 1000 * 3600 * 24);
	 			if(city && district){
		 			models.Order
		 				.statByGrid({
		 					from: from,
		 					to: to,
		 					city: city,
		 					district: district,
			 			},function(err,doc){
			 				if(err) return res.send(err);
			 				res.send(doc);
			 			});
	 			}else if(city){
		 			models.Order
		 				.statByDistrict({
		 					from: from,
		 					to: to,
		 					city: city,
			 			},function(err,doc){
			 				if(err) return res.send(err);
			 				res.send(doc);
			 			});
	 			}else{
		 			models.Order
		 				.statByCity({
		 					from: from,
		 					to: to,
			 			},function(err,doc){
			 				if(err) return res.send(err);
			 				res.send(doc);
			 			});
	 			}
  				break;
 			default:
 				res.send({});
 		}
 	};
 	/**
 	 * router outline
 	 */
 	/**
 	 * get protect/stats/cities
 	 */
 	// app.get('/protect/stats/cities/:id', app.grant, getOne);

 	/**
 	 * get protect/stats
 	 * action:
 	 */
 	app.get('/protect/stats/cities', app.grant, getMore);
 };