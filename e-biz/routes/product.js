exports = module.exports = function(app,models){

	app.get('/categories', function(req,res){
		var parentId = req.query.pid || null;
		// var id = (req.params.id == 'root') ? null: req.params.id;
		models.Product.findCategoriesById(parentId,function(data){
			res.send(data);
		});
	});

	app.post('/categories',function(req,res){
		var parentId = req.body.pid || null;
		var name = req.body.name;
		var description = req.body.description;

		models.Product.addCategory(parentId,{
			name: name,
			description: description
		});
		res.sendStatus(200);
	});

	app.get('/products',function(req,res){
		var categoryId = req.query.cid || null;
		models.Product.findProductsByCategoryId(categoryId,function(data){
			res.send(data);
		});
	});

	app.post('/products',function(req,res){
		var categoryId = req.body.cid || null;
		models.Product.addProduct(categoryId,{

			name: req.body.name,
			description: req.body.description
		});
		res.sendStatus(200);
	});
};