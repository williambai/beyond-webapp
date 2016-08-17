/**
 * 模拟POST 发送订单
 * 
 */

var request = require('request');
var signature = require('./lib/signature');

var client = {
		key: 'key',
		secret: 'secret',
		callback_url: 'http://localhost:3000/callback',
};

var order = {
	customer: {
		mobile: '18500000000',
	},
	product: {
		name: 'product_name', //** 产品名称(goods.name)
		category: '4G', //** 产品分类(goods.category)
		packagecode: '12345k67890e54321TD|111k222e333TD', //** 原始产品集合
		price: 10, //** 产品单价(product.price)
		unit: '元/月', //** 产品单位(product.unit)
	},
	account: {
		name: 'abcdef', //** cbss账户名称
		province_id: '851', //** cbss账户省份编码
		city: '贵阳', //** cbss账户所属城市
	}
};
var result = {
		action: 'create',
		data: order,
		timestamp: parseInt(((new Date()).getTime())/1000),
	};

request({
	method: 'POST',
	url: client.callback_url,
	qs: signature.sign(client.key, client.secret),
	json: true,
	body: result,
},function(err,httpResponse,body){
	if(err) console.log(err);
	console.log('body:' + body);
});
