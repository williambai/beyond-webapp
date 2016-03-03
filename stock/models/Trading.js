exports = module.exports = function(mongoose) {

	var schema = new mongoose.Schema({
		account: {
			id: String,//** 交易账号
			name: String,
		},
		name: String, //** 交易品种名称
		nickname: String, //** 交易品种代码
		symbol: {//** 品种交易别名
			type: String,
			required: '{PATH} is required!',
		},

		direction: {
			type: String,
			enum: '买入|卖出'.split('|'),
			required: '{PATH} is required!',
		},
		price: {
			type: Number,
			required: '{PATH} is required!',
		},
		quantity: {
			type: Number,
			required: '{PATH} is required!',
		},
		tax: {
			type: Number,
			default: 0,
		},
		status: {
			code: {
				type: Number,
				enum: [-1, 0], //-1 未成交；0 成交
				default: 0,
			},
			message: String,
		},
		date: {
			type: String,
			match: [/[0-9]+\-[0-9]+\-[0-9]+/, '{PATH}日期格式不对，格式为 xxxx-xx-xx'],
			required: '{PATH} is required!',
		},
		time: {
			type: String,
			match: [/[0-9]+:[0-9]+:[0-9]+/, '{PATH}时间格式不对，格式为 xx:xx:xx'],
			required: '{PATH} is required!',
		},
		lastupdatetime: {
			type: Date,
			default: Date.now,
		}
	});

	schema.set('collection', 'tradings');
	if (mongoose.models.Trading) {
		return mongoose.model('Trading');
	}
	return mongoose.model('Trading', schema);

};