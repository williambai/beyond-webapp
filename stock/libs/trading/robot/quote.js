var request = require('request');
var _ = require('underscore');

var Quote = function(options) {
	this.options = options || {};
	_.extend(this, Quote);
	return this;
};

Quote.getQuote = function(symbol, callback) {
	request({
		url: 'http://hq.sinajs.cn/list=' + symbol,
		headers: {
			// 'content-type': 'application/x-javascript; charset=GBK'
		}
	}, function(err, response, body) {
		if (err) return callback(err);
		var symbolBody = body.match(/\".*\"/g);

		if (!_.isEmpty(symbolBody)) {
			var quoteData = symbolBody[0].replace('"', '').split(',');
			if (quoteData.length == 33) {
				var quoteObject = {
					symbol: symbol,
					name: quoteData[0], //股票名称
					open: quoteData[1], //今日开盘价
					closed: quoteData[2], //昨日收盘价
					price: quoteData[3], //当前价格
					highest: quoteData[4], //今日最高价
					lowest: quoteData[5], //今日最低价
					buy: quoteData[6], //竞买价，即“买一”报价
					sell: quoteData[7], //竞卖价，即“卖一”报价
					volume: quoteData[8], //成交的股票数，由于股票交易以一百股为基本单位，所以在使用时，通常把该值除以一百
					money: quoteData[9], //成交金额，单位为“元”，为了一目了然，通常以“万元”为成交金额的单位，所以通常把该值除以一万
					buy_v1: quoteData[10], //“买一申请4695股，即47手
					buy_p1: quoteData[11], //“买一报价
					buy_v2: quoteData[12], //买二
					buy_p2: quoteData[13], //买二
					buy_v3: quoteData[14], //“买三
					buy_p3: quoteData[15], //“买三
					buy_v4: quoteData[16], //“买四
					buy_p4: quoteData[17], //“买四
					buy_v5: quoteData[18], //“买五
					buy_p5: quoteData[19], //“买五
					sell_v1: quoteData[20], //“卖一申报3100股，即31手
					sell_p1: quoteData[21], //卖一报价
					sell_v2: quoteData[22], //卖二
					sell_p2: quoteData[23], //卖二
					sell_v3: quoteData[24], //卖三
					sell_p3: quoteData[25], //卖三
					sell_v4: quoteData[26], //卖四
					sell_p4: quoteData[27], //卖四
					sell_v5: quoteData[28], //卖五
					sell_p5: quoteData[29], //卖五
					date: quoteData[30], //日期
					time: quoteData[31], //时间					
				};
				return callback(null, quoteObject);
			}
		}
		callback(null, null);
	});
};

exports = module.exports = Quote;