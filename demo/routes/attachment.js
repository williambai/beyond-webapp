exports =module.exports = function(app,models){
	var path = require('path');
	var fs = require('fs');

	app.post('/attachment/add', app.isLogined, function(req,res){
		// console.log(req.files);
		// res.writeHead(200, {'content-type': 'text/plain'});
		// res.write('received upload:\n\n');
		// var util = require('util');
		// res.end(util.inspect({files: req.files}));
		var file = req.files.files;
		var filename = app.randomHex() + '.' + file.extension;//file.name;
		var tmp_path = file.path;
		var new_path = path.join(__dirname, '../public/_tmp/',filename);
		var attachment = '/_tmp/' + filename;
		fs.rename(tmp_path,new_path,function(err){
			if(err) {
				console.error(err);
				res.sendStatus(400);
				return;
			}
			res.send({
				type: file.extension,
				filename: attachment
			});
		});
	});

	app.post('/attachment/remove', app.isLogined, function(req,res){
		var filename = req.body.filename || '';
		var file_path = path.join(__dirname, '../public/',filename);
		fs.unlink(file_path,function(err){
			if(err) {
				console.error(err);
				res.sendStatus(401);
				return;
			}
			res.sendStatus(200);
		});
	});

};