var expect = require('expect.js');
var bss = require('../index');

describe('BSS 功能：', function() {
	it('.getUserInfo()', function(done) {
		bss.getUserInfo({},function(err,result){
			console.log(err)
			done();
		});
	});
	it('.addOrder() && .removeOrder()', function(done) {
		bss.addOrder({},function(err,result){
			console.log(err)
			xit('.removeOrder()', function(done) {
				bss.removeOrder({},function(err,result){
					console.log(err)
					done();
				});
			});	
		});
	});
	xit('.removeOrder()', function(done) {
		bss.removeOrder({},function(err,result){
			console.log(err)
			done();
		});
	});	
});