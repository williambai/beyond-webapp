var expect = require('expect.js');
var robot = require('../../../libs/trading/robot/robot')();

xdescribe('Robot Module', function() {
	it('期望：buy()调用robot，写入报价', function(done) {
		robot.buy('sh600218',9.01,1000,done);
	});
});
