var should = require('should');
var request = require('./request');
var Order = require('../../app/src/models/Order');
var OrderCollection = require('../../app/src/models/OrderCollection');

var order = {
	customer: {
		email: '1234567',
		username: 'test1',
	},
	game: {
		ltype: 'QGSLTO',
	}
};

describe('/orders', function() {

	describe('validate', function() {
		it('should email validated', function() {
			var order = new Order();
			order.isValid();
			console.log(order.validationError)
		});
	});

	xdescribe('POST /orders', function(){
		it('should add a order', function(done) {
			request(
				{
					url: request.host + '/orders',
					method: 'POST',
					headers: {
						Accept: 'application/json',
						Cookie: request.cookies.agent
					},
					data: order,
				},
				function(err,res,body){
					console.log(body)
					should.not.exist(err);
					should(body).be.String();
					body = JSON.parse(body);
					should(body).be.Object();
					done();
				}
			);
		});
	});

	describe('GET /orders', function() {
		it('should get orders', function(done) {
			request(
				{
					url: request.host + '/orders',
					method: 'GET',
					headers: {
						Accept: 'application/json',
						Cookie: request.cookies.agent
					},
				},
				function(err,res, body){
					should.not.exist(err);

					var orderCollection = new OrderCollection(body);
					// console.log(orderCollection)
					var order = orderCollection.at(0);
					// console.log(order.get('customer'))
					// should(order.get('_id')).not.be(null);
					// body.should.be.instanceof(Array);
					done();
				}
			);
		});
	});
	describe('PUT /orders', function() {
		
	});
});