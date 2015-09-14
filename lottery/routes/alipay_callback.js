exports = module.exports = function(app,models){

var alipayFeedback = function(req,res){

	res.sendStatus(200);
};

/**
 * router outline
 */
 	/**
 	 * alipay callback
 	 */
 	app.post('/alipay/callback', alipayFeedback);

};