exports = module.exports = function(app,models){

var weixinFeedback = function(req,res){

	res.sendStatus(200);
};

/**
 * router outline
 */
 	/**
 	 * weixin callback
 	 */
 	app.post('/weixin/callback', weixinFeedback);

};