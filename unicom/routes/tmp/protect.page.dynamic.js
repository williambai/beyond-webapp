var _ = require('underscore');
var fs = require('fs');
var path = require('path');
exports = module.exports = function(app, models) {
	var add = function(req, res) {
		if (!req.body.name) return res.send({
			code: 40122,
			errmsg: '文件名缺失'
		});
		//** 设置保存模板的目录，默认是views根目录
		var filename = path.join(__dirname, '../views/', req.body.name);
		if (req.body.category == 'include') {
			filename = path.join(__dirname, '../views/include', req.body.name);
		} else if (req.body.category == 'layout') {
			filename = path.join(__dirname, '../views/layout', req.body.name);
		}
		var content = req.body.content || '';
		fs.writeFile(filename, content, function(err) {
			if (err) return res.send(err);
			res.send({});
		});
	};
	var remove = function(req, res) {
		var filename = path.join(__dirname, '../views', req.params.id);
		fs.unlink(filename, function(err) {
			if (err) return res.send(err);
			res.send({});
		});
	};
	var update = function(req, res) {
		var filename = path.join(__dirname, '../views', req.params.id);
		var content = req.body.content || '';
		fs.writeFile(filename, content, function(err) {
			if (err) return res.send(err);
			res.send({});
		});
	};
	var getOne = function(req, res) {
		var filename = path.join(__dirname, '../views', req.params.id);
		console.log(filename)
		var content = fs.readFileSync(filename, {
			encoding: 'utf8'
		});
		res.send({
			name: req.params.id,
			content: content
		});
	};
	var getMore = function(req, res) {
		var per = req.query.per || 20;
		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
		page = (!page || page < 0) ? 0 : page;

		var filepath = path.join(__dirname, '../views');
		fs.readdir(filepath, function(err, filenames) {
			if (err) {
				err.code = 40400;
				return res.send(err);
			}
			var files = [];
			_.each(filenames, function(filename) {
				files.push({
					name: filename
				});
			});
			if (page == 0) {
				res.send(files);
			} else {
				res.send([]);
			}
		});
	};
	/**
	 * router outline
	 */
	/**
	 * add page/dynamics
	 * type:
	 *     
	 */
	app.post('/page/dynamics', add);
	/**
	 * update page/dynamics
	 * type:
	 *     
	 */
	app.put('/page/dynamics/:id', update);

	/**
	 * delete page/dynamics
	 * type:
	 *     
	 */
	app.delete('/page/dynamics/:id', remove);
	/**
	 * get page/dynamics
	 */
	app.get('/page/dynamics/:id', getOne);

	/**
	 * get page/dynamics
	 * type:
	 */
	app.get('/page/dynamics', getMore);
};