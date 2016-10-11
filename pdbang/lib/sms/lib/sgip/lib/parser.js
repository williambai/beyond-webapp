
var Bind = require('./commands/bind');
var Unbind = require('./commands/unbind');
var Submit = require('./commands/submit');

var Parser = {};

Parser.parse = function(buf){
	var len = buf.readUInt32BE(0);
	var cmdId = buf.readUInt32BE(4);
	var commandType;
	switch(cmdId){
		case 0x1: 
			commandType = 'Bind';
			break;
		case 0x80000001: 
			commandType = 'BindResp';
			break;
		case 0x2: 
			commandType = 'Unbind';
			break;
		case 0x80000002: 
			commandType = 'UnbindResp';
			break;
		case 0x3: 
			commandType = 'Submit';
			break;
		case 0x80000003: 
			commandType = 'SubmitResp';
			break;
		case 0x4: 
			commandType = 'Deliver';
			break;
		case 0x80000004: 
			commandType = 'DeliverResp';
			break;
		case 0x5: 
			commandType = 'Report';
			break;
		case 0x80000005: 
			commandType = 'ReportResp';
			break;
		default:
			break;	
	}
};

exports = module.eports = Parser;