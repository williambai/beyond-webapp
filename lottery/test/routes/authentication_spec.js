var request = require('supertest');

var config = {
		server: require('../../config/server'),
		mail: require('../../config/mail'),
		db: require('../../config/db')
	};		

request = request('http://localhost:' + config.server.PORT);

describe('POST /login', function() {
	it('should login correctly.', function() {
		request
			.post('/login')
			.type('form')
			.send({email:'admin@pdbang.cn',password:'123456'})
			.end(function(err,res){
				if(err){
					console.log(err);
					return;
				}
				console.log(res.body);
			});
	});
});
