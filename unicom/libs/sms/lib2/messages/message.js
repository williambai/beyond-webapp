'use strict';

var Message = function(options){
	this.command = options.command;
	this.nodeId = options.nodeId;
	this.timestamp = options.timestamp;
	this.serial = options.serial;
};

Message.prototype.setSequence = function(sequence){
	this.nodeId = sequence.nodeId;
	this.timestamp = sequence.timestamp;
	this.serial = sequence.serial;
};

Message.prototype.getSequence = function(){
	var buf = new Buffer(12);
	buf.writeUInt32BE(this.nodeId,0);
	buf.writeUInt32BE(this.timestamp,4);
	buf.writeUInt32BE(this.serial,8);
	return buf;
};

Message.prototype.toBuffer = Message.prototype.serialize = function(){
	var command = this.command;
	var sequence = this.getSequence();
	var payload = this.getPayload();
	var len = command.length + sequence.length + payload.length;
	var buf = new Buffer(4 + len);
	buf.writeUInt32BE(len, 0);
	command.copy(buf, 4);
	sequence.copy(buf,8);
	payload.copy(buf,20);
	return buf;
};

exports = module.exports = Message;