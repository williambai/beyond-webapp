var express = require('express');
var app = express();
var config = {
		app: {
			NAME: 'demo',
		},
		server: {
			PORT: 8080,

		}
	};

app.set('view engine', 'jade');
app.set('views', __dirname +'/views');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req,res){
	res.render('index.jade',{layout: false});
});

app.listen(config.server.PORT,function(){
	console.log(config.app.NAME + ' App is running at '+ config.server.PORT + ' now.');
});