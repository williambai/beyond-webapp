exports = module.exports = function(app,models){

	app.get('/products',function(req,res){
		var categoryId = req.query.cid || null;
		models.Product.getByCategoryId(categoryId,function(data){
			res.send(data);
		});
	});

	app.post('/products',function(req,res){
		var categoryId = req.body.cid || null;
		models.Product.add(categoryId,{
			name: req.body.name,
			description: req.body.description
		});
		res.sendStatus(200);
	});

	app.get('/products/:id', function(req,res){
		var id = req.params.id;
		models.Product.getById(id,function(data){
			res.send(data);
		});
	});

};