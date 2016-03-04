var order = {};
/**
 * 处理2G/3G/4G订单
 * SMS状态：由收到 转化为 已处理
 * Order状态：由新建 转化为 已处理
 * @param {Function} callback [description]
 */
var _processOrder = function(models,options,done) {
	models.PlatformSms
		.findOneAndUpdate({
			status: '收到',
		}, {
			$set: {
				status: '已处理',
			}
		}, {
			'upsert': false,
			'new': true,
		}, function(err, doc) {
			if (err) return done(err);
			if (!doc) return done(null);
			//** find the order
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
					if (err) return done(err);
					if (!order) return done(null);
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
							if (err) return done(err);
							_processOrder(models,options,done);
						});
				});
		});
};

order.process = function(models,options,done){
	_processOrder(models,options,done);
};

/**
 * 2G/3G 订单确认检查
 * 4G 订单确认检查
 * Order状态：由已处理转化为成功或失败
 * @param {Function} callback [description]
 */
var _confirmOrder = function(models,options,done) {
	models.Order
		.findOne({
			status: '已处理',
		})
		.exec(function(err, order) {
			if (err) return done(err);
			if (!order) return done(null);
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
							if (err) return done(err);
							_confirmOrder(models,options,done);
						});
			} else {
				//** ONLY start check 4G order process(casperjs)
				//** process in confirm4GOrder(req,res)

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
							if (err) return done(err);
							_confirmOrder(models,options,done);
						});
			}

		});
};

order.confirm = function(models,options,done) {
	_confirmOrder(models,options,done);
};

exports = module.exports = order;