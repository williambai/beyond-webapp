var EventEmitter = require('events').EventEmitter;
var util = require('util');

var instance = null;
var started = false;

var SMS = function(){
	//** 一个porcess仅包含一个实例
	if(instance instanceof SMS) return instance;
	EventEmitter.call(this);
	instance = this;
};
util.inherits(SMS, EventEmitter);

SMS.prototype.send = function(mobile,content,done){
	this.sgip.send(mobile,content,done);
};

SMS.prototype.start = function(){
	//** 一个process仅执行一次
	if(started) return;
	started = true;
	this.sgip.start();
};

SMS.prototype.stop = function(){
	this.sgip.stop();
	started = false;
	instance = null;
};

exports = module.exports = SMS;

