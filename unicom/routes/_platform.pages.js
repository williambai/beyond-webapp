exports = module.exports = function(app, models) {


	var _ = require('underscore');
	var fs = require('fs');
	var path = require('path');

	var add = function(req,res){
		if(!req.body.name) return res.send({code: 40122, errmsg: '文件名缺失'});
		var filename = path.join(__dirname, '../public/_pages', req.body.name);
		var content = req.body.content || '';
		fs.writeFile(filename,content, function(err){
			if(err) return res.send(err);
			res.send({});
		});
	};
	var update = function(req,res){
		var filename = path.join(__dirname, '../public/_pages', req.params.id);
		var content = req.body.content || '';
		fs.writeFile(filename, content, function(err){
			if(err) return res.send(err);
			res.send({});
		});
	};
	var remove = function(req,res){
		var filename = path.join(__dirname, '../public/_pages', req.params.id);
		fs.unlink(filename, function(err){
			if(err) return res.send(err);
			res.send({});
		});
	};

	var getOne = function(req,res){
		var filename = path.join(__dirname, '../public/_pages', req.params.id);
		console.log(filename)
		var content = fs.readFileSync(filename,{
				encoding: 'utf8'
			});
		console.log(content)
		res.send({
			name: req.params.id,
			content: content
		});
	};
	var getMore = function(req,res){
 		var per = req.query.per || 20;
 		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
 		page = (!page || page < 0) ? 0 : page;

		var filepath = path.join(__dirname, '../public/_pages');
		fs.readdir(filepath,function(err,filenames){
			if(err){
				err.code = 40400;
				return res.send(err);
			}
			var files = [];
			_.each(filenames,function(filename){
				files.push({name:filename});
			});
			if(page == 0){
				res.send(files);				
			}else{
				res.send([]);
			}
		});
	};
 	/**
 	 * router outline
 	 */
 	/**
 	 * add platform/pages
 	 *     
 	 */
 	app.post('/platform/pages', app.isLogin, add);
 	/**
 	 * update platform/pages
 	 * type:
 	 *     avatar
 	 *     
 	 */
 	app.put('/platform/pages/:id', app.isLogin, update);

 	/**
 	 * delete platform/pages
 	 *     
 	 */
 	app.delete('/platform/pages/:id', app.isLogin, remove);
	/**
 	 * get platform/pages
 	 */
 	app.get('/platform/pages/:id', app.isLogin, getOne);

 	/**
 	 * get platform/pages
 	 * type:
 	 *    search
 	 */
 	app.get('/platform/pages', app.isLogin, getMore);
};