var _ = require('underscore');

exports = module.exports = function(app, models) {

 	var getOne = function(req, res) {
 		var phone = req.params.id || '';
 		models.CustomerPhone
 			.getInfoByPhone({
 				mobile: phone,
 			},function(err, doc) {
 				if (err) return res.send(err);
 				res.send(doc);
 			});
 	};
 	/**
 	 * router outline
 	 */
 	/**
 	 * add public/customer/phones
 	 * type:
 	 *     
 	 */
 	/**
 	 * get public/customer/phones
 	 */
 	app.get('/public/customer/phones/:id', app.isLogin, getOne);

 };