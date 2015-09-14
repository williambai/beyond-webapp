exports = module.exports = function(app,models){

var smsFeedback = function(req,res){

	res.sendStatus(200);
};

/**
 * router outline
 */
 	/**
 	 * sms callback
 	 */
 	app.post('/sms/callback', smsFeedback);

};