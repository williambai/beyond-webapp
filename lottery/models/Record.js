/**
 * 状态图
 * |- start(创建: add)
 *   |- a(status: 0, lastupdatetime: now(), message: 已创建)
 *     |- 修改Record, GOTO a;
 *     |- 删除Record, GOTO end;
 *     |- 出票正确, GOTO b;
 *     |- 出票错误, GOTO c;
 *   |- b(status: 1, lastupdatetime: now(), message: 已出票，且正确)
 *     |- 修改Record, DO nothing;
 *     |- 删除Record, DO nothing;
 *     |- 系统兑奖，GOTO e;
 *   |- c(status(暂态): [-1,-2], lastupdatetime: now(), message: 已出票，有错误，可能需要重新出票)
 *     |- 修改Record, GOTO c;
 *     |- 删除Record, DO nothing;
 *     |- 出票正确, GOTO b;
 *     |- 出票错误, SET{status: status--}, GOTO c;
 *     |- 出票错误二/三次, GOTO d;
 *   |- d(status: -3, lastupdatetime: now(), message: 已出票，有错误，不再重新出票)
 *     |- 修改Record, GOTO c;
 *     |- 删除Record, DO nothing;
 *   |- e(status: 3, lastupdatetime: now(), message: 系统已兑奖)
 *     |- 修改Record, DO nothing;
 *     |- 删除Record, DO nothing;
 *     |- 领奖，GOTO f;
 *     |- 过期未领奖，GOTO g;
 *   |- f(status: 4, lastupdatetime: now(), message: 用户已领奖)
 *     |- 修改Record, DO nothing;
 *     |- 删除Record, DO nothing;
 *   |- g(status: 5, lastupdatetime: now(), message: 用户未领奖，已过期，无法领奖) 
 *     |- 修改Record, DO nothing;
 *     |- 删除Record, DO nothing;
 * |- end(删除: remove)
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

			histories: [],
			status: {
				code: Number,
				message: String,
			},
			sms: {
				code: Number,
				message: String,
			},
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

	return mongoose.model('Record', schema);
};