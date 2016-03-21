/**
 * 财务模块
 * - 用户往来总流水
 */
module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		uid: { //** 用户ID
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Account'
		},
		category: String, //** 账务流水类型，如，充值，购物，提现，佣金，调整等
		amount: Number, //** 账务流水金额，增加为+，减少为-
		entityName: String, //** 分类对应的实体模型的名称
		entityId: String, //** 分类对应的实体模型的_id
		entityContent: {}, //** 分类对应的实体对象的内容
		lastupdatetime: {
			type: Date,
			default: Date.now
		},
	});

	schema.set('collection','finance.journals');
	return mongoose.model('FinanceJournal',schema);
};