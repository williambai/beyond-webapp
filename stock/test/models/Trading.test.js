var mongoose = require('mongoose');
var Model = require('../../models/Trading')(mongoose);

var config = {
	db: require('../../config/db'),
};
var expect = require('expect.js');

describe('期望：models/Trading正确', function() {

	before(function(done) {
		mongoose.connect(config.db.URI, function(err) {
			if (err) {
				console.log(err);
				mongoose.disconnect();
				return process.exit(1);
			}
			done();
		});
	});

	after(function() {
		mongoose.disconnect();
	});

	it('期望：validate检查出必须项', function(done) {
		var model = new Model({
		});
		model.validate(function(err) {
			// console.log(err)
			expect(err).to.be.ok();
			expect(err.name).to.be('ValidationError');
			var errors = err.errors;
			expect(errors['symbol'].kind).to.be('required');
			expect(errors['direction'].kind).to.be('required');
			expect(errors['price'].kind).to.be('required');
			expect(errors['quantity'].kind).to.be('required');
			expect(errors['date'].kind).to.be('required');
			expect(errors['time'].kind).to.be('required');
			done();
		});
	});

	it('期望：validate检查出不符合数据', function(done) {
		var model = new Model({
			date: '1970:01:01',
			time: '12-12-12',
		});
		model.validate(function(err) {
			// console.log(err)
			expect(err).to.be.ok();
			expect(err.name).to.be('ValidationError');
			var errors = err.errors;
			expect(errors['symbol'].kind).to.be('required');
			expect(errors['direction'].kind).to.be('required');
			expect(errors['price'].kind).to.be('required');
			expect(errors['quantity'].kind).to.be('required');
			expect(errors['date'].kind).to.be('regexp');
			expect(errors['time'].kind).to.be('regexp');
			done();
		});
	});

	it('期望：validate检查通过', function(done) {
		var model = new Model({
			symbol: 'sh600001',
			direction: '买入',
			price: 10,
			quantity: 1000,
			date: '1970-01-01',
			time: '12:12:12'
		});
		model.validate(function(err) {
			expect(err).to.not.be.ok();
			done();
		});
	});

});