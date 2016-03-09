/**
//** List Directory format
{ files:
    [
        {
            name: 'node-media-manager',
            display: 'visible',
            type: 'folder',
            path: '/node_modules/node-media-manager'
        }
    ],
    template: '<a data-type="folder" data-path="node_modules/node-media-manager" class="">node-media-manager</a>',
    paths: {
        home: '/Projects/test',
        current: '/Projects/test/node_modules',
        relative: 'node_modules',
        parent: '..'
    }
}
*/

exports = module.exports = function(app, models) {
	var path = require('path');
	var fs = require('fs');
	var _ = require('underscore');
	//** 根目录
	var ROOT = path.join(__dirname, '../');
	//** 需要保护和隐藏的文件夹或文件名
	var ignoreFileOrFolder = {
		'/': ['server.js', 'cronJobs.js', 'sgipService.js']
	};

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
		//** 相对路径
		var relative = (req.params.id || '').replace(/\/\//, '/');
		//** 删除首个/字符
		var filename = relative.slice(1);
		//** 求出父路径
		var parent = relative.replace(/\/$/, ''); //** 去掉最右边的/
		if (parent.lastIndexOf('/') > 0) {
			parent = parent.slice(0, parent.lastIndexOf('/'));
		} else if (parent.lastIndexOf('/') == 0) {
			parent = '/';
		}
		//** 找出需要保护的文件或文件夹
		var ignores = ignoreFileOrFolder[parent];
		//** 忽略需要保护的文件
		if (_.contains(ignores, filename)) {
			return res.send({
				name: req.params.id,
				path: relative,
				content: ''
			});
		}
		var content = req.body.content || '';
		fs.writeFile(path.join(ROOT, relative), content, function(err){
			if(err) return res.send(err);
			res.send({});
		});
	};

	var getOne = function(req, res) {
		//** 相对路径
		var relative = (req.params.id || '').replace(/\/\//, '/');
		//** 删除首个/字符
		var filename = relative.slice(1);
		//** 求出父路径
		var parent = relative.replace(/\/$/, ''); //** 去掉最右边的/
		if (parent.lastIndexOf('/') > 0) {
			parent = parent.slice(0, parent.lastIndexOf('/'));
		} else if (parent.lastIndexOf('/') == 0) {
			parent = '/';
		}
		console.log(parent)
			//** 找出需要保护的文件或文件夹
		var ignores = ignoreFileOrFolder[parent];
		console.log(ignores)
			//** 忽略需要保护的文件
		if (_.contains(ignores, filename)) {
			return res.send({
				name: req.params.id,
				path: relative,
				content: ''
			});
		}

		fs.readFile(path.join(ROOT, relative), {
			encoding: 'utf8'
		}, function(err, content) {
			if (err) return res.send({
				name: req.params.id,
				path: relative,
				content: ''
			});
			res.set('Content-Type', 'application/json');
			res.send({
				name: req.params.id,
				path: relative,
				content: content
			});
		});
	};

	var getMore = function(req, res, next) {
		//** 相对路径
		var relative = req.query.root || '/';
		//** 找出需要保护的文件或文件夹
		var ignores = ignoreFileOrFolder[relative];
		//** 求出父路径
		var parent = relative.replace(/\/$/, ''); //** 去掉最右边的/
		console.log(parent)
		if (parent.lastIndexOf('/') > 0) {
			parent = parent.slice(0, parent.lastIndexOf('/'));
		} else if (parent.lastIndexOf('/') == 0) {
			parent = '/';
		}
		console.log(parent)
		var per = req.query.per || 20;
		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
		page = (!page || page < 0) ? 0 : page;

		var directory = path.join(ROOT, relative);
		fs.readdir(directory, function(err, filenames) {
			if (err) {
				err.code = 40400;
				return res.send(err);
			}

			var files = [];
			_.each(filenames, function(filename) {
				//** 忽略需要保护的文件
				if (_.contains(ignores, filename)) return;

				var filepath = path.join(directory, filename);
				var file = {};
				//** 设置文件名称
				file.name = filename;
				//** 设置文件类型
				var stats = fs.statSync(filepath);
				if (stats.isDirectory()) {
					file.type = 'folder';
				} else if (stats.isFile()) {
					file.type = 'file';
				} else {
					file.type = 'unknown';
				}
				//** 设置文件相对路径
				file.path = (relative + '/' + filename).replace('//', '/');
				//** 保存文件
				files.push(file);
			});
			//** 排序，文件夹在前，文件在后
			var groups = _.groupBy(files, 'type');
			files = [];
			files = files.concat(groups.folder || [],groups.file || []);
			//** 如果不是ROOT，则增加../父目录
			if (directory != ROOT) {
				files.unshift({
					name: '..',
					type: 'folder',
					path: parent,
				});
			}
			//** 增加当前目录
			files.unshift({
				name: '.',
				type: 'folder',
				path: relative,
			});
			if (page == 0) {
				res.send(files);
			} else {
				res.send([]);
			}
		});
	};

	/**
	 * 
	 */
	app.get('/platform/files', getMore);
	app.get('/platform/files/:id', getOne);
	app.put('/platform/files/:id', update);
};