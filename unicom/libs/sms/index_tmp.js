var log4js = require('log4js');
var path = require('path');
log4js.configure(path.join(__dirname,'../../config/log4js.json'));
var logger = log4js.getLogger('libs:sms');
logger.setLevel('DEBUG');

var util = require('util');
var events = require('events');
var net = require('net');
var _ = require('underscore');
var fs = require('fs');

var client = new net.Socket();
var SMS = function(){
	events.EventEmitter.call(this);
};
util.inherit(SMS,events.EventEmitter);

SMS.prototype.connected = false;
SMS.prototype.queue = {};
SMS.prototype.connect = function(options,callback){
	var that = this;
	var HOST = (options && options.HOST) || '127.0.0.1';
	var PORT = (options && options.PORT) || 9999;
	client.connect(PORT, HOST, function(){
		that.connected = true;
		logger.debug('connect to ' + HOST + ':' + PORT);
		that.emit('connected', 'connected.');
	});
	client.on('disconnect', function(){
		that.connected = false;
		that.emit('disconnect', 'disconnect.');
	});
	client.on('error', function(){
		that.connected = false;
		that.emit('error', 'connect error.');
	});
	client.on('data', function(data){
		logger.debug('data: ' + data);

		//1. sent callback
		var id = 1;
		var obj = _.clone(that.queue[id]);
		that.queue = _.omit(that.queue,id);
		obj.callback(null,data);
		//2. notification
		that.emit('answer', data);
	});
	callback && callback();
};

SMS.prototype.send = function(messages, callback){
	if (!_.isArray(messages)) {
		logger.debug('messages must be an Array.');
		return callback(null);
	}
	var that = this;
	if(!that.connected) return callback('disconnect');
	var id = 1;
	that.queue[id] = {
		id: id,
		messages: messages,
		callback: callback
	};
	client.write(messages);
	that.emit('sent');
};

