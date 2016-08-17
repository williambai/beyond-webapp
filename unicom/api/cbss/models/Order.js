var mongoose = require('mongoose');
var connection = mongoose;
var request = require('request');
var signature = require('../lib/signature');
var _ = require('underscore');
var CBSS = require('../../../libs/cbss');//** 联通CBSS系统

var schema = new mongoose.Schema({

	customer: { //** 客户
		name: String, //** 客户姓名
		mobile: String, //** 客户手机号
	},

	product: { //** 产品
		name: String, //** 产品名称(goods.name)
		category: String, //** 产品分类(goods.category)
		packagecode: String, //** 对账用的原始产品集合
		price: Number, //** 产品单价(product.price)
		unit: String, //** 产品单位(product.unit)
	},

	account: {
		name: String, //** cbss账户名称
		province_id: String, //** cbss账户省份编码
		city: String, //** cbss账户所属城市
		pass: String, 
	},

	client: {
		key: String, //** client key
		secret: String, //** client secret
		callback_url: String, //** client callback_url
	},

	status: { //** 订单状态
		type: String,
		enum: {
			values: '新建|正在处理|成功|失败'.split('|'),
			message: ' {PATH} 无效的值 {VALUE}',
		}
	},

	callback_status: { //** 回调状态
		type: String,
		enum: {
			values: '等待处理|成功|失败'.split('|'),
			message: ' {PATH} 无效的值 {VALUE}',
		}
	},

	histories: [], //** 订单修改记录
});

schema.set('collection', 'orders');

/**
 * 处理4G订单
 * @param  {[type]}   accountsEnable [description]
 * @param  {Function} done    [description]
 * @return {[type]}           [description]
 */
schema.statics.process4G = function(accountsEnable, done){
	//** 取出4G程序可处理的城市名称集合，仅处理这些城市的订单
	var cities = CBSS.getAccountCities(accountsEnable);
	var cityRegex = new RegExp('(' + cities.join('|') + ')');

	var Order = connection.model('Order');
	var _process = function(){
			//** find the order
			Order
				.findOneAndUpdate({
					'product.category': {
						$in: ['4G'],
					},
					'status': '新建',
				}, {
					$set: {
						'status': '正在处理',
						'callback_status': '等待处理',
					}
				}, {
					'upsert': false,
					'new': true,
				}, function(err, order) {
					if (err || !order) return done(err);
					//** 处理4G订单的账号，分城市
					var staffAccount = CBSS.getAccountByCity(accountsEnable, order.account.city) || {};
					var productName  = order.product.name || '';
					var productPrice = order.product.price;
					var productBarcode = order.product.packagecode;
					//** 去掉最前面的4G标志
					productName = productName.replace(/^4G/,'');
					//** process 4G order
					if(/^8.*TD$/.test(productBarcode)){
						//** 第二部分：移网产品/变更
						CBSS.orderYiwang({
							cwd: path.resolve(__dirname,'..'),//** 当前工作路径
							tempdir: './_tmp',
							release: staffAccount.release,//** 是否是产品环境
							staffId: staffAccount.staffId,//** 工号
							phone: order.customer.mobile,//** 订购业务的客户手机号码
							product: {
								name: productName,
								price: productPrice,
								barcode: productBarcode,
							}
						},function(err, result){
							//** CBSS 接口返回错误
							if(err) console.log(err);
							//** 将状态改为“成功”或“失败”
							result = result || {};
							//** 如果不是登陆状态
							if(!result.login) return done(null,{logout: true});
							var RespCode = result.code || '88';
							var status = (RespCode == 200) ? '成功' : '失败';
							var RespDesc = status + ': ' + (result.message || '未知错误');
							Order.findByIdAndUpdate(
								order._id,
								{
									$set: {
										status: status
									},
									$push: {
										'histories':  {
											createAt: new Date(),
											message: RespDesc,
										}
									}
								}, {
									'upsert': false,
									'new': true,
								}, function(err, doc){
									var result = {
											action: 'finished',
											code: 0,
											message: 'Ok',
											timestamp: parseInt(((new Date()).getTime())/1000),
										};
									if(err){
										result.code = 40180;
										result.message = JSON.stringify(err);
									}else if(!doc){
										result.code = 40181;
										result.message = '订单不存在';
									}else{
										//** 移除敏感数据
										var docFiltered = _.omit(doc, 'client', 'account','callback_status', 'histories');
										result.data = docFiltered;
									}
									if(doc.client && doc.client.callback_url){
										//** 回调
										request({
											method: 'POST',
											url: doc.client.callback_url,
											qs: signature.sign(doc.client.key, doc.client.secret),
											json: true,
											body: result,
										},function(err,body,response){
											var callback_status = '成功';
											if(err){
												console.log(err);
												callback_status = '失败';
											}else{

											}
											//** 更新callbacl_status
											Order.findByIdAndUpdate(
												order._id,
												{
													$set: {
														'callback_status': callback_status
													},
													$push: {
														'histories':  {
															createAt: new Date(),
															message: err ? ('回调失败: ' + JSON.stringify(err)) : '回调成功',
														}
													}
												}, {
													'upsert': false,
													'new': true,
												}, function(err, doc){
													//** 处理下一个
													_process();
												});
										});
									}else{
										//** 处理下一个
										_process();
									}
								});
						});
					}else{
						//** 处理下一个
						_process();
					}
				});
		};
	//** 启动第一个
	_process();
};


exports = module.exports = function(conn){
	connection = conn || mongoose;
	return connection.model('Order',schema);
}