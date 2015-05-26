exports = module.exports = function(app,models){

	app.get('/categories', function(req,res){
		var parentId = req.query.pid || null;
		// var id = (req.params.id == 'root') ? null: req.params.id;
		models.Category.getChildrenById(parentId,function(data){
			res.send(data);
		});
	});

	app.post('/categories',function(req,res){
		var parentId = req.body.pid || null;
		var name = req.body.name;
		var description = req.body.description;

		models.Category.add(parentId,{
			name: name,
			description: description
		});
		res.sendStatus(200);
	});

	app.get('/categories/:id', function(req,res){
		var id = req.params.id;
		models.Category.getById(id,function(data){
			res.send(data);
		});
	});

	app.put('/categories/:id',function(req,res){
		models.Category.update(req.params.id,req.body);
		res.sendStatus(200);
	});

	app.delete('/categories/:id',function(req,res){
		models.Category.remove(req.params.id);
		res.sendStatus(200);
	});


};