var http = require('http');

var server = http.createServer(function(req,res){
	var trunks = [];
	console.log(req);
	console.log(req.headers);
	req.on('data', function(trunk){
		// console.log(trunk);
		trunks.push(trunk);
	});
	req.on('end', function(){
		console.log(trunks.join('').toString());
	})
	res.end();
});

server.listen(9200, function(){
 console.log('---- start at port 9200 -----');
});