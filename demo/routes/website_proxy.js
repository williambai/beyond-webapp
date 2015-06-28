exports = module.exports = function(app,models){
	var request = require('request');

	app.get('/website/thumbnail', function(req,res){
		res.sendStatus(200);
		return;
		// if(!req.query.url){
		// 	res.sendStatus(400);
		// 	return;
		// }
		// var urlString = decodeURIComponent(req.query.url);
		// console.log(urlString)
		// if(!/^http/.test(urlString)){
		// 	res.sendStatus(400);
		// 	return;
		// }
		// request(urlString,function(err,response,body){
		// 	if(!err && response.statusCode == 200){
		// 		// console.log(body);
		// 	}
		// 	res.sendStatus(200);
		// });
	});
};