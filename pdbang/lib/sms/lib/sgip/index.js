var net = require('net');
var Bind = require('./lib/commands/bind');
var Unbind = require('./lib/commands/unbind');
var Submit = require('./lib/commands/submit');
var Parser = require('./lib/parser');

var SGIP = function(options){
	options = options || {};
	this.host = options.host = options.host || '127.0.0.1';
	this.port = options.port = options.port || 8801;
	this.connection = null;
	this.ready = false;
	this.tryTimes = 0; //** 尝试次数 -1表示永不停止
	this.tryDelay = 1000; //** 尝试延迟
	this.options = options;
};

SGIP.prototype._connect = function(){
	var that = this;
	var connection = net.connect({
		host: that.host,
		port: that.port,
	});
	connection.on('connect', function(){
		that.ready = true;
		console.log('SGIP 连接成功！');
	});
	connection.on('error', function(err){
		that.ready = false;
		if(err && that.tryTimes < 3){
			if(that.tryTimes != -1) that.tryTimes ++;
			setTimeout(function(){
				that._connect();
			},that.tryDelay);
			console.log('连接失败，正在第 '+ that.tryTimes + ' 次尝试，请等待...');
		}else{
			that.server.close();
			console.log(that.tryTimes + ' 次尝试后，连接失败，请检查网络设置。');
			console.log('SGIP 网络连接参数：'+ JSON.stringify(that.options));
		} 
	});
	connection.on('timeout', function(){
		that._connect();
	});

	connection.on('data', function(data){
		that._handler(data);
	});

	that.connection = connection;
};

SGIP.prototype._bind = function(){
	//** send Bind Command
	var bind = new Bind(1, config.SPUser, config.SPPass);
	client.write(bind.makePDU(null,config['NodeID']));
	logger.debug('>> 1.bind');
};

SGIP.prototype._unbind = function(){

};

SGIP.prototype._handler = function(data){

};

SGIP.prototype._service = function(){
	var server = net.createServer();
	server.on('error', function(err){
		console.log('SGIP 接收服务错误。');
	});
	server.on('connection', function(socket){
		console.log('SGIP 接收到连接，准备处理...');
	});
	server.listen(8802, function(){
		console.log('SGIP 接收服务运行在 8802 端口上');
	});
	this.server = server;
};

SGIP.prototype.send = function(mobile,content,done){
	if(!this.ready) done({code: 50100, errmsg: '网络未准备好，无法发送，请稍后再试。'});

};

SGIP.prototype.start = function(){
	this._connect();
	this._service();
};

SGIP.prototype.stop = function(){
	this.server.close();
};

exports = module.exports = SGIP;