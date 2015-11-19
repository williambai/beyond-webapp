var showConsoleLog = false;
var _ = require('underscore');
var expect = require('expect.js');
var strategy = require('../../fixtures/strategies')[0];
var T0 = require('../../../libs/trading/strategies/T0');


describe('T0 交易策略', function() {
	var params = strategy.params;
	var top = params.init_p * (1 + 0.01 * params.sell_gt);
	var bottom = params.init_p * (1 - 0.01 * params.buy_lt);
	before(function() {
		showConsoleLog = true;
	});
	after(function() {
	});
	it('期望：横盘不交易', function() {
		if (showConsoleLog) {
			var logger = console.log;
			console.log = function() {};
		}
		var quotes = [];
		for (var i = 0; i < 100; i++) {
			quotes.push({
				date: '2015-01-01',
				time: '10:00:00',
				price: ((_.random((bottom + 0.01) * 100, (top - 0.01) * 100)) / 100).toFixed(2),
			});
		};
		quotes.forEach(function(quote) {
			// console.log(quote);
			T0.judge(quote, strategy, function(err, data) {
				expect(err).not.to.be.ok();
				expect(data).not.to.be.ok();
			});
		});
		if (showConsoleLog) {
			console.log = logger;
		}
	});
	it('期望: 单边上涨到[init_p * (1 + 0.01 * sell_gt)]，卖出', function() {
		if (showConsoleLog) {
			var logger = console.log;
			console.log = function() {};
		}
		var quotes = [{
			date: '2015-01-01',
			time: '10:00:00',
			price: (bottom + 0.01).toFixed(2),
		}, {
			date: '2015-01-01',
			time: '10:00:00',
			price: Math.ceil(bottom * (1 + 0.01 * params.sell_gt) + 0.01).toFixed(2),
		}, ];
		console.log(quotes);
		T0.judge(quotes[0], strategy, function(err, data) {
			expect(err).not.to.be.ok();
			expect(data).not.to.be.ok();
		});
		T0.judge(quotes[1], strategy, function(err, data) {
			expect(err).not.to.be.ok();
			expect(data).to.be.ok();
			expect(data.action).to.be.equal('sell');
		});
		if (showConsoleLog) {
			console.log = logger;
		}
	});
	xit('测试用例模板', function() {
		if (showConsoleLog) {
			var logger = console.log;
			console.log = function() {};
		}
		//write your code here
		
		if (showConsoleLog) {
			console.log = logger;
		}
	});
});