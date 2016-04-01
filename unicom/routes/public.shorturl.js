var util = require('util');
var path = require('path');
var log4js = require('log4js');
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));

 exports = module.exports = function(app, models) {
 	var _ = require('underscore');
	var crypto = require('crypto');

 	var add = function(req,res){
 		var original = req.body.original || '';
		var shortCode = crypto.createHash('md5').update(original).digest('hex');
		doc = {
			original: original,
			shortCode: shortCode
		}
		models.PlatformShortUrl
			.findOneAndUpdate({
				original: original,
			},{
				$set: doc,
			},{ 'upsert': true,
				'new': true,
			},function(err,newDoc){
				if(err) return res.send(err);
				res.send(newDoc);
			});
 	};

 	var getOne = function(req, res) {
 		var shortCode = req.params.shortCode;
 		models.PlatformShortUrl
 			.findOne({
 				shortCode: shortCode
 			})
 			.exec(function(err, doc) {
 				if (err || !doc) return res.send(404);
 				res.redirect(doc.original);
 			});
 	};

 	/**
 	 * router outline
 	 */
 	/**
 	 * add shorts
 	 */
 	app.post('/s', add);
 	/**
 	 * get shorts/:id
 	 */
 	app.get('/s/:shortCode', getOne);
 };