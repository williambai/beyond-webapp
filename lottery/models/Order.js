/**
 * 状态图
 * |- start (创建：add)
 *   |- a(status: 0, lastupdatetime: now(),message: 已创建)
 *     |- 修改Order(game,expired), GOTO a; 
 *     |- 删除Order, GOTO end; 
 *     |- 生成 Record 正确, GOTO b; 
 *     |- 生成 Record 错误, GOTO c; 
 *   |- b(status: 1, lastupdatetime: now(), message: 已生成出票记录，且正确，当天无需重复生成)
 *     |- 修改Order(game,expired), GOTO b; 
 *     |- 删除Order, DO nothing; 
 *     |- 生成 Record 正确, SET{lastupdatetime: now()}, GOTO b; 
 *     |- 生成 Record 错误, SET{lastupdatetime: now()}, GOTO c; 
 *     |- 是最后一次出票，GOTO e;
 *   |- c(status: [-1,-2], lastupdatetime: now(), message: 已生成出票记录,但有错误，可能需要重新生成)
 *     |- 修改Order(game,expired), GOTO c; 
 *     |- 删除Order, DO nothing; 
 *     |- 重新生成 Record，正确, GOTO b; 
 *     |- 重新生成 Record，错误, SET{status: status--}, GOTO c; 
 *     |- 重新生成 Record，三次错误, GOTO d; 
 *   |- d(status: -3, lastupdatetime: now(), message: 已生成出票记录,但有错误，不再重新出票)
 *     |- 修改Order(game,expired), GOTO c; 
 *     |- 删除Order, DO nothing; 
 *   |- e(status: 3, lastupdatetime: now(), message: 已完成出票记录)
 *     |- 修改Order, DO nothing; 
 *     |- 删除Order, DO nothing; 
 * |- end (删除：remove)
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