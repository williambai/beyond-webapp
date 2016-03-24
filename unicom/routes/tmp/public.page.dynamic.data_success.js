var util = require('util');
var path = require('path');
var log4js = require('log4js');
var logger = log4js.getLogger(path.relative(process.cwd(),__filename));

exports = module.exports = function(app, models) {

	var preview = function(req,res){
		res.set('Content-Type', 'text/html');
		res.render('data_success');
	};

	var addDataSaleLead = function(req,res){
		var pid = req.params.pid;
		models
			.ProductDirect
			.findById(pid)
			.exec(function(err,product){
				if(err || !product) return res.send(err);
				var doc = req.body;
				doc.name = product.name;
				doc.description = product.description;
				models
					.SaleLead
					.create(doc, function(err,result){
						if(err) return res.send(err);
						res.set('Content-Type', 'text/html');
						res.render('data_success');
					});
			});

	};
	
	//** 预览，开发者使用
	app.get('/page/dynamic/data_success/preview',preview);
	app.post('/page/dynamic/data/:appid/:pid/:uid', addDataSaleLead);	
};