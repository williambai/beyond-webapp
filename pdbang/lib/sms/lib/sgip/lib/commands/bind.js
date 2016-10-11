var EventEmitter = require('events').EventEmitter;
var util = require('util');
var Command = require('./command');

var Bind = function() {
	Command.call(this);
	this.COMMAND = 0x1;
};

util.inherits(Bind, Command);

Bind.prototype.set = function(LoginType, LoginName, LoginPassword){
	this.cmdId = 0x1;
	this.loginType = LoginType;
	this.loginName = LoginName;
	this.loginPassword = LoginPassword;
	this.len = this._calculateLen();
};

Bind.prototype._calculateLen = function(){
	return 24 + 
		(new Buffer(this.loginType)).length +
		(new Buffer(this.loginName)).length + 
		(new Buffer(this.loginPassword)).length;
};

Bind.prototype.fromBuffer = function(buf){
	this.len = buf.readUInt32BE(0);
	this.cmdId = buf.readUInt32BE(4);
	if(this.cmdId != this.COMMAND) throw new Error('buffer中命令编码不符');
	this.nodeId = buf.readUInt32BE(8);
	this.timestamp = buf.readUInt32BE(12);
	this.sequence = buf.readUInt32BE(16);
	this.loginType = buf.readUInt8(20);
	this.loginName = buf.toString('utf8',21,21+16);
	this.loginPassword = buf.toString('utf8',21+16,21+16+16);
	this.reserve = buf.toString('utf8',21+16+16,21+16+16+8);
};

Bind.prototype.toBuffer = function(){
	var buf = new Buffer(this.len);
	buf.writeUInt32BE(this.len, 0);
	buf.writeUInt32BE(this.cmdId, 4);
	buf.writeUInt32BE(this.nodeId, 8);
	buf.writeUInt32BE(this.timestamp, 12);
	buf.writeUInt32BE(this.sequence, 16);
	buf.writeUInt8(this.loginType, 20);
	buf.write(this.loginName,21);
	buf.write(this.loginPassword,21+16);
	buf.write(this.reserve,21+16+16);
	return buf;
};

Bind.prototype.toJSON = function(){
	var json = {};
	for(prop in this){
		if(typeof prop == 'string' || typeof prop == 'object'){
			json[prop] = this[prop];
		}
	}
	return json;
};

exports = module.exports = Bind;