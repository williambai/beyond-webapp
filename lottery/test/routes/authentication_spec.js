var should = require('should');
var request = require('./request');

describe('POST /login', function() {
	it('should login correctly.', function() {
		request(
			{
				url: request.host + '/login',
				method: 'POST',
				data: {
					email:'admin@pdbang.cn',
					password:'123456'
				}		
			},
			function(err,res,body){
				should.not.exist(err);
			}
		);
	});
});
