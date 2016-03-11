var quote = require('../libs/trading').quote;
var _ = require('underscore');

exports = module.exports = function(app, models) {

	var add = function(req, res) {
		var strategy = req.body;
		//** 防止上传数据中带有 _id
		strategy = _.omit(strategy, '_id');
		//** 获取股票当前价格
		var symbol = strategy.symbol;
		//** 查找是否已经存在
		models.TradePortfolio
			.findOne({
				symbol: symbol
			})
			.exec(function(err, doc) {
				if (err) return res.send(err);
				//** 获取最新报价
				quote.getQuote(symbol, function(err, stock) {
					//** 复位初始债务
					strategy.debt = 0;
					//** 设置初始资产单价
					strategy.price = Number(stock.price);
					//** 计算初始资产
					var quantity = strategy.quantity || 0;
					strategy.asset = Number(quantity) * Number(stock.price);
					//** 复位已卖出数量
					strategy.quantity_sold = 0;
					//** 复位其他参数
					strategy.times = {
						buy: 0,
						sell: 0,
					};
					strategy.transactions = [];
					strategy.lastupdatetime = new Date();
					if (doc) {
						//** 如果存在，备份到Histrory
						models.TradePortfolioHistory.create({
							backup: doc
						}, function(err, result) {
							if (err) return res.send(err);
							//** 更新
							models.TradePortfolio
								.findByIdAndUpdate(doc._id, strategy, function(err, newDoc) {
									if (err) return res.send(err);
									res.send(newDoc);
								});
						});
					} else {
						//** 创建
						models.TradePortfolio.create(strategy, function(err, doc) {
							if (err) return res.send(err);
							res.send(doc);
						});
					}
				});
			});
	};

	var remove = function(req, res) {
		var id = req.params.id;
		models.TradePortfolio.findByIdAndRemove(id, function(err, doc) {
			if (err) return res.send(err);
			//** 保存到Histroy
			models.TradePortfolioHistory.create({
				backup: doc
			}, function(err, result) {
				if (err) return res.send(err);
				res.send(doc);
			});
		});
	};

	var update = function(req, res) {
		// console.log(req.body)
		var id = req.params.id;
		var strategy = req.body;
		//** 获取股票当前价格
		var symbol = strategy.symbol;
		quote.getQuote(symbol, function(err, stock) {
			//** 复位初始债务
			strategy.debt = 0;
			//** 设置初始资产单价
			strategy.price = Number(stock.price);
			//** 计算初始资产
			var quantity = strategy.quantity || 0;
			strategy.asset = Number(quantity) * Number(stock.price);
			//** 复位已卖出数量
			strategy.quantity_sold = 0;
			//** 复位其他参数
			strategy.transactions = [];
			strategy.times = 0;
			strategy.lastupdatetime = new Date();
			models.TradePortfolio.findByIdAndUpdate(id, {
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
		models.TradePortfolio.findById(req.params.id, function(err, doc) {
			if (err) return res.send(err);
			quote.getQuote(doc.symbol, function(err, stock) {
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
				models.TradePortfolio
					.find(query)
					.sort({
						lastupdatetime: -1
					})
					.skip(per * page)
					.limit(per)
					.exec(function(err, docs) {
						if (err) return res.send(err);
						var symbols = _.pluck(docs, 'symbol');
						//** 获取股票当前价格
						quote.getQuotes(symbols, function(err, stocks) {
							_.each(stocks, function(stock) {
								var newDocs = [];
								// console.log(_.values(stocks))
								_.each(_.values(stocks), function(stock) {
									//** 查找并转化成普通Object
									var doc = (_.findWhere(docs, {
										symbol: stock.symbol
									})).toObject();
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
				models.TradePortfolio
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
						var symbols = _.pluck(docs, 'symbol');
						//** 获取股票当前价格
						quote.getQuotes(symbols, function(err, stocks) {
							var newDocs = [];
							// console.log(_.values(stocks))
							_.each(_.values(stocks), function(stock) {
								//** 查找并转化成普通Object
								var doc = (_.findWhere(docs, {
									symbol: stock.symbol
								})).toObject();
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
	app.post('/trade/portfolios', add);

	/**
	 * delete one
	 */
	app.delete('/trade/portfolios/:id', remove);
	/**
	 * put one
	 */
	app.put('/trade/portfolios/:id', update);
	/**
	 * get one
	 * 
	 */
	app.get('/trade/portfolios/:id', getOne);

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
	app.get('/trade/portfolios', getMore);
};