var util = require('util');
var log4js = require('log4js');
var logger = log4js.getLogger('route:platform.order');
logger.setLevel('INFO');

exports = module.exports = function(app, models) {
	var VMSS = require('../libs/vmss');
	/**
	 * 处理2G/3G/4G订单
	 * SMS状态：由已订购 转化为 已处理
	 * Order状态：由新建 转化为 已处理
	 * @param {Function} callback [description]
	 */
	var processOrder = function(req, res) {
		models.SMS
			.findOneAndUpdate({
				status: '已订购',
			}, {
				$set: {
					status: '已处理',
				}
			}, {
				'upsert': false,
				'new': true,
			}, function(err, doc) {
				if (err) return res.send(err);
				if (!doc) return res.send({});
				//** find order
				models.Order
					.findOneAndUpdate({
						status: '新建',
					}, {
						$set: {
							status: '已处理',
						}
					}, {
						'upsert': false,
						'new': true,
					}, function(err, order) {
						if (err) return res.send(err);
						if (!order) return res.send({});
						//** process 2G/3G order



						//** process 4G order
						var path = require('path');
						cbss_cwd = path.join(__dirname, '../libs/cbss');
						var worker = require('child_process').execFile(
							'casperjs', [
								'order.casper.js',
								'--id=' + id,
								'--cookie=' + JSON.stringify(doc.cookies),

							], {
								cwd: cbss_cwd,
							},
							function(err, stdout, stderr) {
								if (err) console.error(err);
							});
						res.send({});
					});
			});
	};

	/**
	 * 2G/3G 订单确认检查
	 * Order状态：由已处理转化为成功或失败
	 * @param {Function} callback [description]
	 */
	var confirmOrder = function(req, res) {
		models.Order
			.findOne({
				status: '已处理',
			})
			.exec(function(err, order) {
				if (err) return res.send(err);
				if (!order) return res.send({});
				//** check order status
				if (order.category == '2G' || order.category == '3G') {
					//** check 2G/3G order
					VMSS.soap(function() {

					});
					var status = success ? '失败' : '成功';

					models.Order
						.findByIdAndUpdate(order._id, {
								$set: {
									status: status,
								}
							}, {
								'upsert': false,
								'new': true,
							},
							function(err, doc) {
								if (err) return res.send(err);
								res.send({});
							});
				} else {
					//** ONLY start check 4G order process(casperjs)
					//** process in confirm4GOrder(req,res)
				}

			});
	};

	var confirm4GOrder = function(req, res) {
		var id = req.body.id;
		var status = req.body.success ? '失败' : '成功';

		models.Order
			.findByIdAndUpdate(id, {
					$set: {
						status: status,
					}
				}, {
					'upsert': false,
					'new': true,
				},
				function(err, doc) {
					if (err) return callback(err);
					callback(null);
				});
	};

	var add = function(req, res) {
		var action = req.body.action || '';
		switch (action) {
			case 'processOrder':
				//** call from command
				processOrder(req, res);
				break;
			case 'confirmOrder':
				//** call from command
				confirmOrder(req, res);
				break;
			case 'confirm4GOrder':
				//** call from casperjs
				confirm4GOrder(req, res);
				break;
			default:
				res.send({});
				break;
		}
	};
	var remove = function(req, res) {
		var id = req.params.id;
		models.Order.findByIdAndRemove(id, function(err, doc) {
			if (err) return res.send(err);
			res.send(doc);
		});
	};
	var update = function(req, res) {
		var id = req.params.id;
		var set = req.body;
		models.Order.findByIdAndUpdate(id, {
				$set: set
			}, {
				'upsert': false,
				'new': true,
			},
			function(err, doc) {
				if (err) return res.send(err);
				res.send(doc);
			}
		);
	};
	var getOne = function(req, res) {
		var id = req.params.id;
		models.Order
			.findById(id)
			.exec(function(err, doc) {
				if (err) return res.send(err);
				res.send(doc);
			});
	};
	var getMore = function(req, res) {
		var type = req.query.type || '';
		var per = req.query.per || 20;
		var page = (!req.query.page || req.query.page < 0) ? 0 : req.query.page;
		page = (!page || page < 0) ? 0 : page;
		switch (type) {
			case 'category':
				models.Order
					.find({
						category: req.query.category,
						status: '有效',
					})
					.skip(per * page)
					.limit(per)
					.exec(function(err, docs) {
						if (err) return res.send(err);
						res.send(docs);
					});
				break;
			default:
				models.Order
					.find({})
					.skip(per * page)
					.limit(per)
					.exec(function(err, docs) {
						if (err) return res.send(err);
						res.send(docs);
					});
		}
	};
	/**
	 * router outline
	 */
	/**
	 * add platform/orders
	 * type:
	 *     
	 */
	app.post('/platform/orders', add);
	/**
	 * update platform/orders
	 * type:
	 *     
	 */
	app.put('/platform/orders/:id', update);

	/**
	 * delete platform/orders
	 * type:
	 *     
	 */
	app.delete('/platform/orders/:id', remove);
	/**
	 * get platform/orders
	 */
	app.get('/platform/orders/:id', getOne);

	/**
	 * get platform/orders
	 * type:
	 */
	app.get('/platform/orders', getMore);
};