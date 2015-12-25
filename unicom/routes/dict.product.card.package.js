 exports = module.exports = function(app, models) {
 	var packages = require('../models/ProductCardPackage');

 	var getMore = function(req,res){
 		res.send(packages);
 	};
 	/**
 	 * get product/card/packages
 	 */
 	app.get('/product/card/packages', getMore);
 };