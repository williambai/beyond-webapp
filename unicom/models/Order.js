module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		name: String, //** 订单编码
		description: String, //** 订单描述
		category: { //** 订单分类
			type: String,
			enum: {
				values: '数据订购|传统增值|内容推荐|活动推荐|号卡|终端|金币兑换'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		},
		customer: {
			id: String, //** 客户Id(customer._id)
			name: String, //** 客户姓名
			mobile: String, //** 客户手机号
			idNo: String, //** 客户身份证号码
			idType: String, //** 客户身份证类型
			idAddress: String, //** 客户身份证地址
			address: String, //** 客户通讯地址
			phone: String,//** 客户备用联系电话
			location: String, //** 客户地理位置
		},
		items: [ //** 订单项目
			{
				id: String, //** 产品id(goods._id)
				name: String,//** 产品名称(goods.name)
				category: String, //** 产品分类(goods.category)
				barcode: String, //** 产品编码(goods.barcode)
				price: Number, //** 商品单价(product.price)
				quantity: Number, //** 商品数量(product.quantity)
				referer: {}, //** 商品来源(product._id、商品模型名称或商品其他信息)			
				//Deprecated!
				source: {},//goods 
				id: mongoose.Schema.Types.ObjectId,
				model: String,
			}
		],
		total: Number,
		place: {
			name: String,//** 订单发生地
		},
		dispatch: { //** 订单配送
			method: {
				type: String,
				enum: {
					values: '自提|物流'.split('|'),
					message: 'enum validator failed for path {PATH} with value {VALUE}',
				}
			},
			phone: String,
			address: String,
		},
		//Deprecated!!
		customerInfo: { //** 客户其他信息
			name: String,
			idNo: String, //** 客户身份证号码
			idType: String, //** 客户身份证类型
			idAddress: String, //** 客户身份证地址
			address: String, //** 客户通讯地址
			phone: String,//** 客户备用联系电话
			location: String, //** 客户地理位置
		},
		createBy: { //** 订单创建者
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Account',
			},
			username: String,
			mobile: String,
			avatar: String,
		},
		bonus: { //** 佣金情况
			income: Number,
			times: Number,
			points: {
				type: Number,
				default: 0
			},
			cash: {
				type: Number,
				default: 0
			},
			cashStatus: {
				type: String,
				enum: {
					values: '冻结|一次解冻|二次解冻|三次解冻|全部解冻'.split('|'),
					message: 'enum validator failed for path {PATH} with value {VALUE}',
				},
				default: '冻结',
			},			
		},
		status: { //** 订单状态
			type: String,
			enum: {
				values: '新建|已确认|已配送|完成|用户取消|后台取消|其他原因'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		},
		histories: [], //** 订单修改记录
		lastupdatetime: {
			type: Date,
			default: Date.now
		},
	});

	schema.set('collection','orders');
	return mongoose.model('Order',schema);
};