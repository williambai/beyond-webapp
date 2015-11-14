var expect = require('expect.js');
var quote = require('../../../libs/trading/robot/quote')();

xdescribe('Quote Module', function() {
	it('期望：getQuote()获取正确的报价', function(done) {
		quote.getQuote('sh600218', function(err,quote){
			// if(err) return console.error(err);
			// console.log(quote);
			expect(err).not.to.be.ok();
			expect(quote).not.to.be.empty();
			expect(quote).to.have.property('symbol');
			expect(quote).to.have.property('price');
			done();
		});
	});
});
