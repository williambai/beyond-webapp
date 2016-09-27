exports = module.exports = function(app, models){
	var add = function(req,res){
		var spot = req.body;
		var Spot = models.Spot;
		Spot.create(spot, function(err){
			if(err) return res.send(err);
			res.send({});
		});
	};

	var remove = function(req,res){
		var id = req.params.id;
		var Spot = models.Spot;
		Spot.findByIdAndRemove(id,function(err){
			if(err) return res.send(err);
			res.send({});
		});
	};

	var update = function(req,res){
		var id = req.params.id;
		var set = req.body || {};
		set = _.omit(set,'_id');

		var Spot = models.Spot;
		Spot.findByIdAndUpdate(
			id,
			{
				$set: set
			},
			{
				'upsert': false,
				'new': true,
			},
			function(err){
				if(err) return res.send(err);
				res.send({});
			}
		);
	};

	var getById = function(req,res){
		var id = req.params.id;
		var Spot = models.Spot;
		Spot.findById(id, function(err, doc){
			if(err) return res.send(err);
			return res.send(doc);
		});
	};

	var getMore = function(req,res){
 		var per = 10;
 		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
 		page = (!page || page < 0) ? 0 : page;
		var action = req.query.action || '';
		var Spot = models.Spot;
		switch(action){
			case 'search':
				var query = req.query || {};
				break;
			default: 
				Spot.find({})
		 			.skip(per * page)
		 			.limit(per)
					.exec(function(err,docs){
						if(err) return res.send(err);
						res.send({
							page: 0,
							per: per,
							total: 100,
							collection: docs,
						});
					});
				break;
		}
	};

app.post('/api/admin/spots', add);	
app.delete('/api/admin/spots/:id', remove);
app.put('/api/admin/spots/:id', update);
app.get('/api/admin/spots/:id', getById);
app.get('/api/admin/spots', getMore);
};