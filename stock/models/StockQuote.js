exports = module.exports = function(mongoose) {

	var schema = new mongoose.Schema({
		symbol: String,
		name: String,//股票名称
		open: Number,//今日开盘价
		closed: Number,//昨日收盘价
		price: Number,//当前价格
		highest: Number,//今日最高价
		lowest: Number,//今日最低价
		buy: Number,//竞买价，即“买一”报价
		sell: Number,//竞卖价，即“卖一”报价
		quantity: Number,//成交的股票数，由于股票交易以一百股为基本单位，所以在使用时，通常把该值除以一百
		money: Number,//成交金额，单位为“元”，为了一目了然，通常以“万元”为成交金额的单位，所以通常把该值除以一万
		buy_v1: Number,//“买一申请4695股，即47手
		buy_p1: Number,//“买一报价
		buy_v2: Number,//买二
		buy_p2: Number,//买二
		buy_v3: Number,//“买三
		buy_p3: Number,//“买三
		buy_v4: Number,//“买四
		buy_p4: Number,//“买四
		buy_v5: Number,//“买五
		buy_p5: Number,//“买五
		sell_v1: Number,//“卖一申报3100股，即31手
		sell_p1: Number,//卖一报价
		sell_v2: Number,//卖二
		sell_p2: Number,//卖二
		sell_v3: Number,//卖三
		sell_p3: Number,//卖三
		sell_v4: Number,//卖四
		sell_p4: Number,//卖四
		sell_v5: Number,//卖五
		sell_p5: Number,//卖五
		date: String,//日期
		time: String,//时间
	});

	schema.set('collection', 'stockquotes');
	if (mongoose.models.Trading) {
		return mongoose.model('StockQuote');
	}
	return mongoose.model('StockQuote', schema);
};