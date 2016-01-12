var VMSS = require('../libs/vmss');
/**
 * 处理2G/3G/4G订单
 * SMS状态：由已回复 转化为 已处理
 * Order状态：由新建 转化为 已处理
 * @param {Function} callback [description]
 */
var processOrder = function(callback) {
	models.SMS
		.findOneAndUpdate({
			status: '已回复',
			reply: 1,
		}, {
			$set: {
				status: '已处理',
			}
		}, {
			'upsert': false,
			'new': true,
		}, function(err, doc) {
			if (err) return callback(err);
			if (!doc) return callback();
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
					if (err) return callback(err);
					if (!order) return callback();
					//** process 2G/3G order



					//** process 4G order
					var path = require('path');
					cbss_cwd = path.join(__dirname, '../libs/cbss');
					var worker = require('child_process').execFile(
						'casperjs', [
							'order.casper.js',
							'--id=' + id,
							'--cookie=' + doc.cookieRaw,
						], {
							cwd: cbss_cwd,
						},
						function(err, stdout, stderr) {
							if (err) console.error(err);
							var success = /status=200/.test(stdout);
							if(!success) console.error('update 4G error id:' + doc._id);
							callback();
						});
				});
		});
};

/**
 * 2G/3G 订单确认检查
 * Order状态：由已处理转化为成功或失败
 * @param {Function} callback [description]
 */
var confirmOrder = function(callback) {
		models.Order
			.findOne({
				status: '已处理',
			})
			.exec(function(err, order) {
				if (err) return callback(err);
				if (!order) return callback(null);
				//** check order status
				if(order.category == '2G' || order.category == '3G'){
					//** check 2G/3G order
					VMSS.soap(function(){

					});					
				}else{
					//** check 4G order

				}
				//** 成功
				models.Order
					.findByIdAndUpdate(order._id, {
							$set: {
								status: '成功',
							}
						}, {
							'upsert': false,
							'new': true,
						},
						function(err, doc) {
							if (err) return callback(err);
							callback(null);
						});
				//** 失败
				models.Order
					.findByIdAndUpdate(order._id, {
							$set: {
								status: '失败',
							}
						}, {
							'upsert': false,
							'new': true,
						},
						function(err, doc) {
							if (err) return callback(err);
							callback(null);
						});
			});
	}

//command
if (process.argv[1] === __filename) {

}