var _ = require('underscore');

exports = module.exports = function(app, models) {

	var getOne = function(req, res) {
 		var email = req.params.id;
 		console.log(email)
 		models.Account
 			.findOne({
 				email: email
 			})
 			.exec(function(err, doc) {
 				if (err) return res.send(err);
 				if(!doc) return res.send({});
 				var filteredDoc = _.pick(doc, '_id','email');
 				res.send(filteredDoc);
 			});
 	};
 	/**
 	 * router outline
 	 */

 	/**
 	 * get public/accounts
 	 * type:
 	 */
 	app.get('/public/accounts/:id', getOne);
 };