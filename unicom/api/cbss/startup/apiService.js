var http = require('http');
var request = require('request');
var express = require('express');
var authenticate = require('../lib/authenticate');
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');

var config = {
	db: require('../config/db')
};

//import the models
var models = {};
fs.readdirSync(path.resolve(__dirname, '../models')).forEach(function(file) {
	if (/\.js$/.test(file)) {
		var modelName = file.substr(0, file.length - 3);
		models[modelName] = require('../models/' + modelName)(mongoose);
	}
});

mongoose.connect(config.db.URI, function onMongooseError(err) {
	if (err) {
		logger.error('Error: can not open Mongodb.');
		throw err;
	}
});

var app = express();

//** gzip/deflate outgoing response
var compression = require('compression');
app.use(compression());

//** parse urlencoding request bodies into req.body
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

//** response to all requests
app.get('/',function(req,res){
	res.end('welcome!\n');
});

//** development for callback
app.post('/callback', function(req,res){
	console.log('这是开发时用的回调验证：');
	console.log(req.body);
	res.send({});
});

app.use(authenticate());
app.use(bodyParser.json());
app.post('/orders', function(req,res){
	var user = req.user;
	var action = req.body.action || '';
	switch(action){
		case 'create':
			if(!req.body.data) return res.status(400).send({code: 40000, message: 'JSON数据内容不对：缺少data对象节点'});
			var account = req.body.data.account;
			var customer = req.body.data.custmer;
			var product = req.body.data.product;
			if(!(account && customer && product)) return res.status(400).send({code: 40001, message: 'JSON数据内容不对：缺少account,customer或product对象节点'});
			var mobile = customer.mobile;
			if(!(mobile && /^\d{11}$/.mobile)) return res.status(400).send({code: 40002, message: 'JSON数据内容不对：缺少customer.mobile节点或格式不对'});
			var packagecode = product.packagecode;
			if(!(packagecode && /^\dk\de\dTD$/.packagecode)) return res.status(400).send({code: 40003, message: 'JSON数据内容不对：缺少product.packagecode节点或格式不对'});
			if(!(account.name && account.province_id)) return res.status(400).send({code: 40004, message: 'JSON数据内容不对：缺少account.name,province_id节点或格式不对'});
			var Order = models.Order;
			var order = {
				customer: {
					mobile: mobile,
				},
				product:{
					packagecode: packagecode,
				},
				account: {
					name: account.name,
					province_id: account.province_id,
				},
				client: {
					key: user.key,
					secret: user.secret,
					callback_url: user.callback_url,
				},
				status: '新建',
			};
			Order.create(order, function(err){
				var result = {
						action: action,
						code: 0,
						message: '成功',
						timestamp: parseInt(((new Date()).getTime())/1000),
					};
				if(err){
					result.code = 40110;
					result.message = JSON.stringify(err);
				}else{
					result.data = {
						id: order._id,
						status: '等待处理',
					};
				}
				res.send(result);
			});
			break;
		case 'getOne':
			if(!req.body.data) return res.status(400).send({code: 40000, message: 'JSON数据内容不对：缺少data对象节点'});
			var id = req.body.data.id;
			if(!id) return res.status(400).send({code: 40001, message: 'JSON数据内容不对：缺少data.id节点'});
			var Order = models.Order;
			Order.findOne(id,function(err,doc){
				var result = {
						action: action,
						code: 0,
						message: '成功',
						timestamp: parseInt(((new Date()).getTime())/1000),
					};
				if(err){
					result.code = 40110;
					result.message = JSON.stringify(err);
				}else{
					result.data = doc || {};
				}
				res.send(result);
			});
			break;
		case 'getMore':
			if(!req.body.data) return res.status(400).send({code: 40000, message: 'JSON数据内容不对：缺少data对象节点'});
			var id = req.body.data.id;
			if(!(id && id instanceof Array)) return res.status(400).send({code: 40001, message: 'JSON数据内容不对：缺少data.id节点'});
			var Order = models.Order;
			Order.find({
				$or:id
			},function(err,docs){
				var result = {
						action: action,
						code: 0,
						message: '成功',
						timestamp: parseInt(((new Date()).getTime())/1000),
					};
				if(err){
					result.code = 40110;
					result.message = JSON.stringify(err);
				}else{
					result.data = docs || [];
				}
				res.send(result);

			});
			break;
		default:
			var result = {
					action: action,
					code: 40190,
					message: '改功能未实现',
					timestamp: parseInt(((new Date()).getTime())/1000),
				};
			res.send(result);
			break;
	}
});


//** create node.js http server and listen on port
http.createServer(app).listen(3000, function(){
	console.log('CBSS API service started on port 3000.\n');
});

//** process uncaughtException
process.on('uncaughtException', function(){
	logger.warn('uncaughtException and process exit.');
	mongoose.disconnect();
	process.exit(1);
});

