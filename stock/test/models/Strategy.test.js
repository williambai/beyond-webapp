var mongoose = require('mongoose');
var Model = require('../../models/Strategy')(mongoose);

var config = {
	db: require('../../config/db'),
};
var expect = require('expect.js');

describe('期望：models/Strategy正确', function() {

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
			expect(errors['init.name'].kind).to.be('required');
			expect(errors['init.risk_h'].kind).to.be('required');
			expect(errors['init.risk_l'].kind).to.be('required');
			expect(errors['init.init_p'].kind).to.be('required');
			expect(errors['init.init_v'].kind).to.be('required');
			expect(errors['init.buy_lt'].kind).to.be('required');
			expect(errors['init.sell_gt'].kind).to.be('required');
			expect(errors['init.amount'].kind).to.be('required');
			done();
		});
	});

	it('期望：validate检查出不符合数据', function(done) {
		var model = new Model({
			symbol: 'sh600001',
			init: {
				name: 'T0',
				risk_h: 10,
				risk_l: 100,
				init_p: 10,
				init_v: 1000,
				buy_lt: 10,
				sell_gt: 20,
				amount: 1000,
				method: 'add'
			},
		});
		model.validate(function(err) {
			// console.log(err)
			expect(err).to.be.ok();
			expect(err.name).to.be('ValidationError');
			var errors = err.errors;
			expect(errors['init.risk_h'].kind).to.be('NumberError');
			expect(errors['init.risk_l'].kind).to.be('NumberError');
			expect(errors['init.method'].kind).to.be('enum');
			done();
		});
	});

	it('期望：validate检查通过', function(done) {
		var model = new Model({
			symbol: 'sh600001',
			init: {
				name: 'T0',
				risk_h: 100,
				risk_l: 10,
				init_p: 10,
				init_v: 1000,
				buy_lt: 1,
				sell_gt: 2,
				amount: 1000,
				method: 'eq'
			},
			status: {
				code: 1
			}
		});
		model.validate(function(err) {
			expect(err).to.not.be.ok();
			done();
		});
	});

});