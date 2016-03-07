var quote = require('../libs/trading').quote;
var _ = require('underscore');

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
		// console.log(req.body)
		var id = req.params.id;
		var strategy = req.body;
		//** 获取股票当前价格
		var symbol = strategy.symbol;
		quote.getQuote(symbol,function(err,stock){
			//** 复位初始债务
			strategy.debt = 0;
			//** 计算初始资产
			var quantity = strategy.quantity || 0;
			strategy.asset = Number(quantity) * Number(stock.price);
			//** 复位已卖出数量
			strategy.quantity_sold = 0;
			//** 复位其他参数
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
		});
	};
	var getOne = function(req, res) {
		models.Strategy.findById(req.params.id, function(err, doc) {
			if (err) return res.send(err);
			quote.getQuote(doc.symbol, function(err,stock){
				//** 查找并转化成普通Object
				var newDoc = doc.toObject();
				//** 插入当前股票价格
				newDoc.currentPrice = Number(stock.price);
				res.send(newDoc);
			});
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
						var symbols = _.pluck(docs,'symbol');
						//** 获取股票当前价格
						quote.getQuotes(symbols,function(err,stocks){
							_.each(stocks,function(stock){
								var newDocs = [];
								// console.log(_.values(stocks))
								_.each(_.values(stocks),function(stock){
									//** 查找并转化成普通Object
									var doc = (_.findWhere(docs, {symbol:stock.symbol})).toObject();
									//** 插入当前股票价格
									doc.currentPrice = Number(stock.price);
									newDocs.push(doc);
								});
							});
							res.send(docs);
						});					
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
						var symbols = _.pluck(docs,'symbol');
						//** 获取股票当前价格
						quote.getQuotes(symbols,function(err,stocks){
							var newDocs = [];
							// console.log(_.values(stocks))
							_.each(_.values(stocks),function(stock){
								//** 查找并转化成普通Object
								var doc = (_.findWhere(docs, {symbol:stock.symbol})).toObject();
								//** 插入当前股票价格
								doc.currentPrice = Number(stock.price);
								newDocs.push(doc);
							});
							res.send(newDocs);
						});					
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