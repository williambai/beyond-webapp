exports = module.exports = function(app,model){
	var _ = require('underscore');

	app.post('/cart',function(req,res){
		req.session.cart = req.session.cart || [];
		req.session.cart.push(req.body);
		res.sendStatus(200);
	});

	app.get('/cart',function(req,res){
		res.send(req.session.cart || []);
	});

	app.put('/cart/:id',function(req,res){
		var products = req.session.cart || [];
		req.session.cart = _.map(products,function(product){
			if(product._id == req.params.id){
				_.extend(product,req.body);
			}
			return product;
		});		
		res.sendStatus(200);
	});

	app.delete('/cart/:id',function(req,res){
		var products = req.session.cart || [];
		products.each(function(product){
			if(product._id == req.params.id){
				req.session.cart = _.without(products,product);
			}
		});
		res.sendStatus(200);
	});
};