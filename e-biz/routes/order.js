exports = module.exports = function(app,models){
	
	app.post('/orders',function(req,res){
		models.Order.add(req.body);
	});

	app.get('/orders', function(req,res){
		model.Order.getByPage(req.query.page || 0, function(docs){
			res.send(docs);
		});
	});

	app.get('/orders/:id', function(req,res){
		model.Order.getById(req.params.id, function(doc){
			res.send(doc);
		});
	});

	app.put('/orders/:id', function(req,res){
		model.Order.update(req.params.id, req.body);
		res.sendStatus(200);
	});

	app.delete('/orders/:id', function(req,res){
		model.Order.remove(req.params.id);
		res.sendStatus(200);
	});
};