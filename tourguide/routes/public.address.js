exports = module.exports = function(app, models){

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
		var action = req.params.type || '';
		var Spot = models.Spot;
		switch(action){
			case 'search':
				var query = req.query || {};
				res.send({});
				break;
			case 'country': 
				Spot.getAllCountries(function(err,docs){
						if(err) return res.send(err);
						res.send({
							page: 0,
							per: per,
							total: 100,
							collection: docs,
						});
					});
				break;
			case 'province': 
				Spot.getAllProvinces(function(err,docs){
						if(err) return res.send(err);
						res.send({
							page: 0,
							per: per,
							total: 100,
							collection: docs,
						});
					});
				break;
			case 'city': 
				Spot.getAllCities(function(err,docs){
						if(err) return res.send(err);
						res.send({
							page: 0,
							per: per,
							total: 100,
							collection: docs,
						});
					});
				break;
			default: 
				res.send({});
		}
	};

app.get('/api/public/addresses/:type', getMore);
};