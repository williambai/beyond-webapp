exports = module.exports = function(app, models) {

	var add = function(req, res) {
		var strategy = req.body;
		strategy.params = strategy.params || {};
		strategy.params.name = 'T0';
		strategy.params.description = 'T0 交易';
		strategy.times = 0;
		strategy.method = 'eq';
		strategy.lastupdatetime = new Date();
		models.Strategy.create(strategy, function(err, doc) {
			if (err) return res.send(err);
			res.send(doc);
		});
	};

	var update = function(req, res) {
		console.log(req.body)
		var id = req.params.id;
		var strategy = req.body;
		strategy.transactions = [];
		strategy.times = 0;
		strategy.lastupdatetime = new Date();
		models.Strategy.findByIdAndUpdate(id, {
			$set: strategy,
		}, {
			upsert: false
		}, function(err, doc) {
			if (err) return res.send(err);
			res.send(doc);
		});
	};
	var getOne = function(req, res) {
		models.Strategy.findById(req.params.id, function(err, doc) {
			if (err) return res.send(err);
			res.send(doc);
		});
	};

	var getMore = function(req, res) {
		var per = 20;
		var type = req.query.type || '';
		var page = req.query.page || 0;
		page = (!page || page < 0) ? 0 : page;
		var query = {};
		switch (type) {
			case 'search':
				var now = new Date();
				var symbol = req.query.symbol
				var from = new Date();
				from.setTime(req.query.from || 0);
				var to = new Date();
				to.setTime(req.query.to || now);
				var searchStr = req.query.searchStr || '';
				var searchRegex = new RegExp(searchStr, 'i');
				query = {
					lastupdatetime: {
						$gte: from,
						$lt: to
					},
					$or: [{
						'symbol': {
							$regex: searchRegex
						}
					}, {
						'status.message': {
							$regex: searchRegex
						}
					}]
				};
				models.Strategy
					.find(query)
					.sort({
						lastupdatetime: -1
					})
					.skip(per * page)
					.limit(per)
					.exec(function(err, docs) {
						if (err) return res.send(err);
						res.send(docs);
					});
				break;
			default:
				query = {};
				models.Strategy
					.find(query)
					.select({
						transactions: 0
					})
					.sort({
						lastupdatetime: -1
					})
					.skip(per * page)
					.limit(per)
					.exec(function(err, docs) {
						if (err) return res.send(err);
						res.send(docs);
					});
				break;
		}
	};

	/**
	 * router outline
	 */

	/**
	 * post one
	 */
	app.post('/strategy', add);

	/**
	 * put one
	 */
	app.put('/strategy/:id', update);
	/**
	 * get one
	 * 
	 */
	app.get('/strategy/:id', getOne);

	/**
	 * get more
	 *   type: graph
	 *      params:
	 *         symbol: stock symbol
	 *   type: search
	 *      params: 
	 *         searchStr: search string, '600218'
	 *         from: date begin, i.e. 2015-01-01
	 *         to: date end
	 */
	app.get('/strategy', getMore);
};