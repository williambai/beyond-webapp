var request = require('request');

describe('POST /getlot.dll', function() {

	it('should behave...', function(done) {
	request("http://localhost:9001/", function(error, response, body){
	    expect(body).toEqual("hello world!");
	    done();
	  });
	});
	xit('should behave...', function() {
		var message = {
			head: {
				messageid: '',
				command: 1003,
				encrypt: 0,
				compress: 0,
				timestamp: (new Date()).getTime(),
			},
		};
		request
			.post('/getlot')
			.type('form')
			.send({message:message})
			.expect(200)
			.expect(function(res){
				expect(true)
				res.body.head.command = 1002;
			})
			.end(function(err,res){
				if(err) throw err;
				console.log(res)
			});
			
	});	
});
