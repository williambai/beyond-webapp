'use strict';

var Message = require('../message');
var inherits = require('util').inherits;

var BindRespMessage = function(arg, options){
	Message.call(this,options);
	this.command = 'bindResp';
	this.result = arg.result;
	this.reserve = arg.reserve;
};

inherits(BindRespMessage,Message);

BindRespMessage.prototype.setPayload = function(payload){
	var buf = new Buffer(payload);
	this.result = buf.readUInt8(0);
	this.reserve = buf.toString('utf8',1,8);
};

BindRespMessage.prototype.getPayload = function(){
	var buf = new Buffer(9);
	buf.writeUInt8(this.result,0);
	buf.write(this.reserve, 1, 8, 'utf8');
	return buf;
};

exports = module.exports = BindRespMessage;