var expect = require('expect.js');

var config = {
	T0: {
		sh600218: {
			risk_h: 15.00, //区间高点(元)
			risk_l: 9.0, //区间地点(元)
			bid_p: 11.80, //上次成交价(元)
			bid_v: 1000, //上次买入量(股)
			buy_at: 0.2, //上涨%百分比(绝对值)，买入
			sell_at: 0.2, //下跌%百分比(绝对值)，卖出
			amount: 10000.00, //每次买入金额(元)
			status: 0, //上次状态：0:买入; 1: 卖出
		}
	}
};

var quote = require('../../../libs/trading/robot/quote');
var t0 = require('../../../libs/trading/strategies/T0')(config.T0);



xdescribe('T+0 交易策略', function() {
	xit('期望：start() and stop() 正确', function() {
			var intervalObject = setInterval(function() {
				var symbols = _.keys(t0.options);
				quote.getQuote(symbols[0], function(err, stock) {
					if (err) return console.log(err);
					t0.judge(stock);
				});
			}, 5000);
			// setTimeout(function() {
			// 	clearInterval(intervalObject);
			// }, 11000);
	}); it('期望: 上涨3%，买入', function() {

}); it('期望: 下跌3%，卖出', function() {

});
});