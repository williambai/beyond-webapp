var path = require('path');
var _ = require('underscore');
var logger = require('log4js').getLogger(path.relative(process.cwd(),__filename));
var request = require('request');

var Quote = {};

Quote.isQuoteTime = function() {
	var now = new Date();
	var day = now.getDay();
	var hh = now.getHours();
	var mm = now.getMinutes();
	var ss = now.getSeconds();
	var morningBeginTime = 9 * 60 * 60 + 25 * 60; //9:25:00
	var morningEndTime = 11 * 60 * 60 + 35 * 60; //11:35:00
	var afternoonBeginTime = 13 * 60 * 60 - 5*60; //12:55:00
	var afternonnEndTime = 15 * 60 * 60 + 5 * 60; //15:05:00
	var seconds = (parseInt(hh) * 3600 + parseInt(mm) * 60 + parseInt(ss));
	//is working day?
	if (day > 0 && day < 6) {
		//is trading time?
		if ((seconds > morningBeginTime && seconds < morningEndTime) ||
			(seconds > afternoonBeginTime && seconds < afternonnEndTime)) {
			return true;
		}
		// if ((seconds > morningBeginTime && seconds < afternonnEndTime)) {
		// 	return true;
		// }
	}
	return false;
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
					quantity: quoteData[8], //成交的股票数，由于股票交易以一百股为基本单位，所以在使用时，通常把该值除以一百
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

Quote.getQuotes = function(symbols, callback) {
	request({
		url: 'http://hq.sinajs.cn/list=' + symbols.join(','),
		headers: {
			// 'content-type': 'application/x-javascript; charset=GBK'
		}
	}, function(err, response, body) {
		if (err) return callback(err);
		var lines = body.split('\n');
		lines = _.filter(lines,function(line){
			return line.length > 10;
		});
		var quoteObjects = {};
		lines.forEach(function(line){
			var symbol = line.match(/hq_str_.*=/g);
			symbol = symbol[0].replace('hq_str_','').replace('=','');
			var symbolBody = line.match(/\".*\"/g);
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
						quantity: quoteData[8], //成交的股票数，由于股票交易以一百股为基本单位，所以在使用时，通常把该值除以一百
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
					quoteObjects[symbol] = quoteObject;
				}
			}
		});
		callback(null, quoteObjects);
	});
};
exports = module.exports = Quote;