var path = require('path');
var logger = require('log4js').getLogger(path.relative(process.cwd(), __filename));

exports =module.exports = function(app,models){
	var path = require('path');
	var fs = require('fs');

	var randomHex = function(){
		return new Date().getTime();
	};
	var add = function(req,res){
			// console.log(req.files);
			// res.writeHead(200, {'content-type': 'text/plain'});
			// res.write('received upload:\n\n');
			// var util = require('util');
			// res.end(util.inspect({files: req.files}));
			var file = req.files.files;
			var filename = randomHex() + '.' + file.extension;//file.name;
			var tmp_path = file.path;
			var new_path = path.join(__dirname, '../public/_tmp/',filename);
			var attachment = '/_tmp/' + filename;
			fs.rename(tmp_path,new_path,function(err){
				if(err) console.error(err);
				if(err) return res.send({code: 40000, errmsg: 'upload error.'});

				res.send({
					type: file.extension,
					filename: attachment
				});
			});
		};

	var remove = function(req,res){
			var filename = req.body.filename || '';
			var file_path = path.join(__dirname, '../public/',filename);
			fs.unlink(file_path,function(err){
				if(err) console.error(err);
				if(err) return res.send({code: 40100, errmsg: 'delete file error.'});
				
				res.send({});
			});
		};

/**
 * router outline
 */

 	/**
 	 * add an attachment
 	 */
 	app.post('/upload', app.isLogined, add);
 	/**
 	 * remove an attachment
 	 */
 	app.delete('/upload', app.isLogined, remove);
};