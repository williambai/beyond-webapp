'use strict';

var Message = require('../message');
var inherits = require('util').inherits;

var BindMessage = function(arg, options){
	// if(arguments.length != 2) throw new Error('必须有两个参数(arg, options)');
	// if(!(arg && arg.loginType && arg.loginName && arg.loginPassword)) throw new Error('arg 参数不满足要求');
	arg = arg || {};
	options = options || {};

	Message.call(this,options);

	this.command = 'submit';
	this.loginType = args.loginType;
	this.loginName = args.loginName;
	this.loginPassword = args.loginPassword;
};

inherits(BindMessage,Message);

BindMessage.prototype.setPayload = function(payload){
	var buf = new Buffer(payload);
	this.loginType = buf.readUInt8(0);
	this.loginName = buf.toString('utf8', 1, 16);
	this.loginPassword = buf.toString('utf8', 16, 32);
	this.reserve = buf.toString('utf8', 32, 40);
};

BindMessage.prototype.getPayload = function(){
	var buf = new Buffer(9);
	buf.writeUInt8(this.loginType,0);
	buf.write(this.loginName, 1, 16, 'utf8');
	buf.write(this.loginPassword, 16, 16, 'utf8');
	buf.write(this.reserve, 32, 8, 'utf8');
	return buf;
};

exports = module.exports = BindMessage;