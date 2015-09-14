/**
 * 状态图
 * |- start (创建：add)
 *   |- a(status: 0, lastupdatetime: now(),message: 已创建)
 *     |- 修改Order(game,expired), GOTO a; 
 *     |- 删除Order, GOTO end; 
 *     |- 订单不合法，GOTO f;
 *     |- 生成 Record 正确, GOTO b; 
 *     |- 生成 Record 错误, GOTO c; 
 *   |- b(status: 1, lastupdatetime: now(), message: 已生成出票记录，且正确，当天无需重复生成)
 *     |- 修改Order(game,expired), GOTO b; 
 *     |- 删除Order, DO nothing; 
 *     |- 订单不合法，GOTO f;
 *     |- 生成 Record 正确, SET{lastupdatetime: now()}, GOTO b; 
 *     |- 生成 Record 错误, SET{lastupdatetime: now()}, GOTO c; 
 *     |- 是最后一次出票，GOTO e;
 *   |- c(status(暂态): [-1,-2], lastupdatetime: now(), message: 已生成出票记录,但有错误，可能需要重新生成)
 *     |- 修改Order(game,expired), GOTO c; 
 *     |- 删除Order, DO nothing; 
 *     |- 订单不合法，GOTO f;
 *     |- 重新生成 Record，正确, GOTO b; 
 *     |- 重新生成 Record，错误, SET{status: status--}, GOTO c; 
 *     |- 重新生成 Record，三次错误, GOTO d; 
 *   |- d(status: -3, lastupdatetime: now(), message: 已生成出票记录,但有错误，不再重新生成)
 *     |- 修改Order(game,expired), GOTO c; 
 *     |- 删除Order, DO nothing; 
 *   |- e(status: 3, lastupdatetime: now(), message: 已完成所有出票记录，订单关闭)
 *     |- 修改Order, DO nothing; 
 *     |- 删除Order, DO nothing; 
 *   |- f(status: -4, lastupdatetime: now(), message: 未生成出票记录,有错误，不再重新生成)
 *     |- 修改Order(game,expired), SET{status: -2}, GOTO c; 
 *     |- 删除Order, DO nothing; 
 * |- end (删除：remove)
 * 
 * sms状态图
 * |- start(创建: add)
 *   |- a(sms: 0, message: 不发SMS)
 *   |- b(sms: 1, message: 需要发SMS)
 *     |- 发送成功，GOTO c;
 *     |- 发送失败，GOTO d;
 *   |- c(sms: 2, message: SMS发送成功)
 *   |- d(sms: [-1,-2,-3], message: 需要重新发送SMS)
 *     |- 发送成功，GOTO c;
 *     |- 发送失败，SET{sms: sms--}, GOTO d;
 *     |- 发送失败操作三次, GOTO e;
 *   |- e(sms: -4, SMS发送失败,不再发送)
 *     |- 补发SMS, GOTO d;
 *     
 */

module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
			customer: {
				id: String,
				email: String,
				username: String,
			},
			game: {
				ltype: String,
				playtype: String,
				chipintype: Number,
				content: String,
				periods: Number,
				remained: Number,
				sms: String,
			},
			createby: {
				id: String,
				email: String,
				username: String,
			},
			records: [],//records
			status: Number, //0: enable, -1: disable
			expired: Date,
			sms: Number,
			lastupdatetime: Date,
		});

	schema.static.addHistory = function(id,history,callback){
		callback = callback || function(){};
		this.model.findOneAndUpdate(
			{
				_id: id
			},
			{
				$push: {'histroies': history}
			},
			callback
		);
	};

	schema.static.addRecord = function(id,record,callback){
		callback = callback || function(){};
		this.model.findOneAndUpdate(
			{
				_id: id
			},
			{
				$push: {'records': record}
			},
			callback
		);
	};

	return mongoose.model('Order', schema);
};