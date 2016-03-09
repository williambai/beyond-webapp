var _ = require('underscore');
var fs = require('fs');
var path = require('path');
exports = module.exports = function(app, models) {

	var add = function(req,res){
		if(!req.body.name) return res.send({code: 40122, errmsg: '文件名缺失'});
		var filename = path.join(__dirname, '../public/statics', req.body.name);
		var content = req.body.content || '';
		fs.writeFile(filename,content, function(err){
			if(err) return res.send(err);
			res.send({});
		});
	};
	var update = function(req,res){
		var filename = path.join(__dirname, '../public/statics', req.params.id);
		var content = req.body.content || '';
		fs.writeFile(filename, content, function(err){
			if(err) return res.send(err);
			res.send({});
		});
	};
	var remove = function(req,res){
		var filename = path.join(__dirname, '../public/statics', req.params.id);
		fs.unlink(filename, function(err){
			if(err) return res.send(err);
			res.send({});
		});
	};

	var getOne = function(req,res){
		var filename = path.join(__dirname, '../public/statics', req.params.id);
		console.log(filename)
		var content = fs.readFileSync(filename,{
				encoding: 'utf8'
			});
		res.send({
			name: req.params.id,
			content: content
		});
	};
	var getMore = function(req,res){
 		var per = req.query.per || 20;
 		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
 		page = (!page || page < 0) ? 0 : page;

		var filepath = path.join(__dirname, '../public/statics');
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
 	 * add page/statics
 	 *     
 	 */
 	app.post('/page/statics', app.isLogin, add);
 	/**
 	 * update page/statics
 	 * type:
 	 *     avatar
 	 *     
 	 */
 	app.put('/page/statics/:id', app.isLogin, update);

 	/**
 	 * delete page/statics
 	 *     
 	 */
 	app.delete('/page/statics/:id', app.isLogin, remove);
	/**
 	 * get page/statics
 	 */
 	app.get('/page/statics/:id', app.isLogin, getOne);

 	/**
 	 * get page/statics
 	 * type:
 	 *    search
 	 */
 	app.get('/page/statics', app.isLogin, getMore);
};