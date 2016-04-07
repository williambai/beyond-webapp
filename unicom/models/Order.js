var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	customer: { //** 客户
		mobile: String, //** 客户手机号
		id: String, //** 客户Id(customer._id)
		name: String, //** 客户姓名
		idNo: String, //** 客户身份证号码
		idType: String, //** 客户身份证类型
		idAddress: String, //** 客户身份证地址
		address: String, //** 客户通讯地址
		phone: String, //** 客户备用联系电话
		location: String, //** 客户地理位置
	},
	goods: { //** 产品
		name: String, //** 产品名称(goods.name)
		id: String, //** 产品id(goods._id)
		category: String, //** 产品分类(goods.category)
		barcode: String, //** 产品编码(goods.barcode)
		smscode: String, //** 业务(SMS)编码(goods.smscode)
		price: Number, //** 产品单价(product.price)
		bonus: Number, //** 单个产品佣金
	},
	thumbnail: String, //** 商品图标
	quantity: { //** 商品数量(product.quantity)
		type: Number,
		default: 0,
	},
	total: { //** 订单总价
		type: Number,
		default: 0,
	},
	bonus: { //** 订单红利
		cash: { //** 佣金
			type: Number,
			default: 0,
		},
		points: { //** 积分
			type: Number,
			default: 0,
		}
	},
	createBy: { //** 订单创建者
		id: String,
		username: String,
		mobile: String,
		avatar: String,
	},
	department: {
		id: String,
		name: String, //** 营业厅名称
		city: String, //** 城市名称
		grid: String, //** 网格编码
		district: String, //** 地区编码			
	},
	status: { //** 订单状态
		type: String,
		enum: {
			values: '新建|已处理|成功|失败'.split('|'),
			message: 'enum validator failed for path {PATH} with value {VALUE}',
		}
	},
	histories: [], //** 订单修改记录
	lastupdatetime: {
		type: Date,
		default: Date.now
	},
});

schema.set('collection', 'orders');

module.exports = exports = function(connection){
	connection = connection || mongoose;
	return connection.model('Order', schema);
};


// //Deprecated!!
// customerInfo: { //** 客户其他信息
// 	name: String,
// 	idNo: String, //** 客户身份证号码
// 	idType: String, //** 客户身份证类型
// 	idAddress: String, //** 客户身份证地址
// 	address: String, //** 客户通讯地址
// 	phone: String,//** 客户备用联系电话
// 	location: String, //** 客户地理位置
// },
// //Deprecated!!
// name: String, //** 订单编码
// description: String, //** 订单描述
// category: { //** 订单分类
// 	type: String,
// 	enum: {
// 		values: '数据订购|传统增值|内容推荐|活动推荐|号卡|终端|金币兑换'.split('|'),
// 		message: 'enum validator failed for path {PATH} with value {VALUE}',
// 	}
// },
// bonus: { //** 佣金情况
// income: Number,
// times: Number,
// points: {
// 	type: Number,
// 	default: 0
// },
// cash: {
// 	type: Number,
// 	default: 0
// },
// cashStatus: {
// 	type: String,
// 	enum: {
// 		values: '冻结|一次解冻|二次解冻|三次解冻|全部解冻'.split('|'),
// 		message: 'enum validator failed for path {PATH} with value {VALUE}',
// 	},
// 	default: '冻结',
// },			
// },
// place: {
// 	name: String,//** 订单发生地
// },
// dispatch: { //** 订单配送
// 	method: {
// 		type: String,
// 		enum: {
// 			values: '自提|物流'.split('|'),
// 			message: 'enum validator failed for path {PATH} with value {VALUE}',
// 		}
// 	},
// 	phone: String,
// 	address: String,
// },