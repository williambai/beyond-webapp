var path = require('path');
var logger = require('log4js').getLogger(path.relative(process.cwd(), __filename));
var mongoose = require('mongoose');
var connection = mongoose;
var spawn = require('child_process').execFile;

var schema = new mongoose.Schema({
	account: {//** StockAccount 交易账号信息
		id: String,
		user: {//账户所有人信息
			name: String,//** 真实姓名
		},
		company: {
			id: String,
			name: String,
			avatar: String,
		},
	},
	transaction: {//** 交易
		price: {
			type: Number, //成交价(元)
			min: 0,
			max: 100,
		},
		quantity: {
			type: Number, //买入量(股)
			min: -100000,
			max: 100000,
		},
		direction: {
			type: String, 
			enum: {
				values: '买入|卖出'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			},
		},
		date: {
			type: String,
			match: [/[0-9]+\-[0-9]+\-[0-9]+/, '{PATH}日期格式不对，格式为 xxxx-xx-xx'],
			required: true,
		},
		time: {
			type: String,
			match: [/[0-9]+:[0-9]+:[0-9]+/, '{PATH}时间格式不对，格式为 xx:xx:xx'],
			required: true,
		},
	},
	status: {
		type: String,
		enum: {
			values: '新建|下单|成功|失败'.split('|'),
			message: 'enum validator failed for path {PATH} with value {VALUE}',
		},
		default: '新建',
	},
});

schema.set('collection','trade.orders');

/**
 * 处理买入/卖出订单
 * 
 */
schema.statics.process = function(options, done){
	if(typeof options == 'function'){
		done = options;
		options = {};
	}
	var _process = function(){
		connection.models.TradeOrder
			.findOneAndUpdate({
					status: '新建'
				},{
					$set: {
						status: '下单'
					}
				}, {
					'upsert': false,
					'new': true,
				}, function(err, doc){
					if (err) return done(err);
					if (!doc) return done();
					var id = doc._id;
					//** 处理 买入/卖出 订单
					switch(doc.transaction.direction){
						case '买入':
							logger.info('执行买入订单：' + id);
							spawn(
								'casperjs', [
									'order.buy.casper.js',
									'--id=' + id,
									'--cookie=' + JSON.stringify(doc.cookies),
									// '--callback_url=' + 'http://localhost:8091/stock/tradings'
								], {
									cwd: path.resolve(__dirname, '../libs/citic'),
								},
								function(err, stdout, stderr) {
									if (err) logger.error(err);
									logger.debug('-----citic buy order begin --------');
									logger.debug(stdout);
									logger.debug('-----citic buy order end --------');
									setTimeout(function() {
										_process();
									}, 1000);
								});
							break;
						case '卖出':
							logger.info('执行卖出订单：' + id);
							spawn(
								'casperjs', [
									'order.sale.casper.js',
									'--id=' + id,
									'--cookie=' + JSON.stringify(doc.cookies),
									// '--callback_url=' + 'http://localhost:8091/stock/orders'
								], {
									cwd: path.resolve(__dirname, '../libs/citic'),
								},
								function(err, stdout, stderr) {
									if (err) logger.error(err);
									logger.debug('-----citic sale order begin --------');
									logger.debug(stdout);
									logger.debug('-----citic sale order end --------');
									setTimeout(function() {
										_process();
									}, 1000);
								});
							break;
						default:
							break;
					}
				});
	};
	_process();
};

/**
 * 确认买入/卖出订单是否成功
 */
schema.statics.confirm = function(options,done){
	if(typeof options == 'function'){
		done = options;
		options = {};
	}
	var _confirm = function(){
		connection.models.TradeOrder
			.findOne({
					status: '下单',
				}, function(err, doc){
					if (err) return done(err);
					if (!doc) return done();
					var id = doc._id;
					//** 检查 买入/卖出 订单
					switch(doc.transaction.direction){
						case '买入':
							logger.info('检查买入订单是否下单成功：' + id);
							spawn(
								'casperjs', [
									'check.buy.casper.js',
									'--id=' + id,
									'--cookie=' + JSON.stringify(doc.cookies),
								], {
									cwd: path.resolve(__dirname, '../libs/citic'),
								},
								function(err, stdout, stderr) {
									if (err) logger.error(err);
									logger.debug('-----citic check buy order begin --------');
									logger.debug(stdout);
									logger.debug('-----citic check buy order end --------');
									//** 判断是否成功
									var status;
									if(/confirm_buy:true/.test(stdout)){
										status = '成功';
									}else if(/confirm_buy:false/.test(stdout)){
										status = '失败';
									}
									//** 如果有定论，则
									if(status){
										connection.models.TradeOrder
											.findByIdAndUpdate(id,{
												$set: {
													'status': status
												}
											}, {
												'upsert': false,
												'new': true,
											}, function(err){
												if(err) return done(err);
												setTimeout(function() {
													_confirm();
												}, 1000);
											});
									}
								});
							break;
						case '卖出':
							logger.info('检查卖出订单是否下单成功：' + id);
							spawn(
								'casperjs', [
									'check.sale.casper.js',
									'--id=' + id,
									'--cookie=' + JSON.stringify(doc.cookies),
								], {
									cwd: path.resolve(__dirname, '../libs/citic'),
								},
								function(err, stdout, stderr) {
									if (err) logger.error(err);
									logger.debug('-----citic check sale order begin --------');
									logger.debug(stdout);
									logger.debug('-----citic check sale order end --------');
										//** 判断是否成功
										var status;
										if(/confirm_sale:true/.test(stdout)){
											status = '成功';
										}else if(/confirm_sale:false/.test(stdout)){
											status = '失败';
										}
										//** 如果有定论，则
										if(status){
											connection.models.TradeOrder
												.findByIdAndUpdate(id,{
													$set: {
														'status': status
													}
												}, {
													'upsert': false,
													'new': true,
												}, function(err){
													if(err) return done(err);
													setTimeout(function() {
														_confirm();
													}, 1000);
												});
										}
									});
							break;
						default:
							break;
					}
				});
	};
	_confirm();
};


module.exports = exports = function(conn){
	connection = conn || mongoose;
	return connection.model('TradeOrder',schema);
};
