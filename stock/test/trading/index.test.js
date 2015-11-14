var expect = require('expect.js');
var mongoose = require('mongoose');
var trading = require('../../libs/trading')();
var config = {
	db: require('../../config/db'),
};

describe('libs/Trading', function() {
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

	it('期望：setModels()', function(done) {
		expect(trading.models).to.be.an(Object);
		expect(trading.models.Strategy).not.to.be.an(Object);
		var models = {
			Strategy: require('../../models/Strategy')(mongoose),
		};
		trading.setModels(models);
		expect(trading.models).to.be.an(Object);
		expect(trading.models.Strategy).to.be.an(Object);
		done();
	});
	it('期望：run()', function(done) {
		this.timeout(5000);
		trading.run(function(err,result){
			if(err) console.log(err);
			// console.log(result);
			done();
		});
	});
});

