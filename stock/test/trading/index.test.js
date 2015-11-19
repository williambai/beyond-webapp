var expect = require('expect.js');
var mongoose = require('mongoose');
var trading = require('../../libs/trading');
var config = {
	db: require('../../config/db'),
};
//** import the models
var models = {
	StockQuote: require('../../models/StockQuote')(mongoose),
	Trading: require('../../models/Trading')(mongoose),
	Strategy: require('../../models/Strategy')(mongoose),
};

xdescribe('libs/Trading', function() {
	before(function(done) {
		mongoose.connect(config.db.URI, function(err) {
			done();
		});
	});

	after(function() {
		mongoose.disconnect();
	});

	xit('期望：run()', function(done) {
		this.timeout(5000);
		trading.run(function(err,result){
			if(err) console.log(err);
			// console.log(result);
			done();
		});
	});
});

