//** @Deprecated!
exports = module.exports  = {};
/**
 * 处理2G/3G/4G订单
 * SMS状态：由收到 转化为 已处理
 * Order状态：由新建 转化为 已处理
 * @param {Function} callback [description]
 */
var _processOrder = function(models,options,done) {
	if(arguments.length<3) throw new Error('参数不足：function(models,options,done)');
	options = options || {};
	if (!options.SPNumber) throw new Error('options对象参数不足，至少包含：{SPNumber}。');
	var SPNumber = options.SPNumber || '10655836';

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
			if (err || !doc) return done(err);
			//** 提取客户号码，去除最前面的86
			var mobile = (doc.sender || '').replace(/^86/, '');
			//** 提取业务(短信)代码，去除SPNumber(10655836)部分
			var regexSmscode = new RegExp('^' + SPNumber, 'i');
			var smscode = (doc.receiver || '').replace(regexSmscode,'');
			//** find the order
			models.Order
				.findOneAndUpdate({
					'customer.mobile': mobile,
					'goods.smscode': smscode,
					'status': '新建',
				}, {
					$set: {
						status: '已处理',
					}
				}, {
					'upsert': false,
					'new': true,
				}, function(err, order) {
					if (err || !order) return done(err);
					//** process 2G/3G order



					//** process 4G order
					// var path = require('path');
					// cbss_cwd = path.join(__dirname, '../libs/cbss');
					// var worker = require('child_process').execFile(
					// 	'casperjs', [
					// 		'order.casper.js',
					// 		'--id=' + id,
					// 		'--cookie=' + JSON.stringify(doc.cookies),

					// 	], {
					// 		cwd: cbss_cwd,
					// 	},
					// 	function(err, stdout, stderr) {
					// 		if (err) return done(err);
					// 		_processOrder(models,options,done);
					// 	});
					done(null);
				});
		});
};

exports.process = function(models,options,done){
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
							if (err || !doc) return done(err);
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
							if (err || !doc) return done(err);
							_confirmOrder(models,options,done);
						});
			}

		});
};

exports.confirm = function(models,options,done) {
	_confirmOrder(models,options,done);
};