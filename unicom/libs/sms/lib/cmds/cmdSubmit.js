var A = require('../attributes');
var util = require('../util.js'),
	CmdSeq = require('../sequence.js'),
	override2 = util.override2,
	cannedOptions = {};

var defOptions = require('../../../../config/sms').options;

// convert defOptions to a instance object of a class
function CDefOptions() {
	for (var n in defOptions) {
		this[n] = defOptions[n];
	}
}


/**
 * create a submit PDU object with required parameters and options
 * @param UserNumber
 * @param MessageContent
 * @param options may be a name-value object, or predefined option ID string, or array of ether of them
 * @constructor
 */
function Submit(UserNumber, MessageCoding, MessageContent, options) {
	if (arguments.length === 0) return; // it is for receiver to parse PDU only
	var myOptions = {};
	myOptions.__proto__ = defOptions;

	if (options) {
		if (!(options instanceof Array))
			options = [options];
		options.forEach(function(opt) {
			if (opt instanceof String) {
				override2(myOptions, cannedOptions[opt]);
			} else if (typeof opt === 'object') {
				override2(myOptions, opt);
			} else {
				throw new Error('options must be cannedOptions ID or options name-value pair object!');
			}
		});
	}
	this.options = myOptions;

	if (UserNumber instanceof Array) {
		this.UserCount = UserNumber.length;
		this.UserNumber = UserNumber;
	} else {
		this.UserCount = 1;
		this.UserNumber = [UserNumber];
	}

	this.MessageCoding = MessageCoding; // todo: for digit id only or automatic detected, default to what ??

	if (MessageContent instanceof Buffer) {
		this.MessageContent = MessageContent;
	} else {
		this.MessageContentOrigin = MessageContent;
		switch (MessageCoding) {
			case 0: // acsii
				this.MessageContent = new Buffer(MessageContent, 'ascii');
				break;
			case 8: // ucs2
				var bin = new Buffer(MessageContent, 'ucs2');
				for (var i = 0, len = bin.length; i < len; i += 2) {
					bin.writeUInt16BE(bin.readUInt16LE(i), i);
				}
				this.MessageContent = bin;
				break;
			case 4: // binary
				this.MessageContent = new Buffer(MessageContent, 'hex');
				break;
			default:
				throw new Error('only encoding 0-ascii, 8-usc2, 4-binary(hex) is supported');
		}
	}

	var msglen = this.MessageLength = this.MessageContent.length;

	if (msglen > 254) {
		// save original attributes
		this.MessageContentLong = this.MessageContent;
		this.MessageLengthLong = msglen;

		var splits = this.splits = this.lackAckCnt = Math.ceil(msglen / (140 - 6));
		var parts = this.MessageContentParts = new Buffer(msglen + 6 * splits);
		var batchID = Math.random() * 256;
		for (var i = 0; i < splits; i++) {
			(new Buffer([0x05, 0x00, 0x03, batchID, splits, i + 1])).copy(parts, i * 140);
			this.MessageContentLong.slice(i * (140 - 6), Math.min((i + 1) * (140 - 6), msglen)).copy(parts, i * 140 + 6);
		}

		// set to first part
		this.MessageLength = 140;
		this.MessageContent = parts.slice(0, 140);
		this.options['TP_udhi'] = 1;
	} else {
		this.lackAckCnt = 1;
	}
}
Submit.code = 0x3;

Submit.PDUAttrSeq = [A.SPNumber, A.ChargeNumber, A.UserCount, A.UserNumber, null, A.CorpId, A.ServiceType, A.FeeType, A.FeeValue, A.GivenValue, A.AgentFlag, A.MorelatetoMTFlag, A.Priority, A.ExpireTime, A.ScheduleTime, A.ReportFlag, A.TP_pid, A.TP_udhi, A.MessageCoding, A.MessageType, A.MessageLength, A.MessageContent];

Submit.Resp = function(){};
Submit.Resp.code = 0x80000003;
Submit.Resp.PDUAttrSeq = [A.Result];

Submit.prototype.getPDULength = function() {
	return Submit.fixedPartLength + (this.UserNumber.length - 1) * A.UserNumber.len + this.MessageLength;
};

Submit.prototype.followParts = function(PDU) {
	var splits = this.splits,
		len = PDU.length,
		remain = this.MessageContentParts.length % 140 || 140,
		PDUs = new Buffer(len * splits - (140 - remain)),
		pos = len - 8 - 140;
	PDU.copy(PDUs);
	for (var i = 2; i < splits; i++) {
		CmdSeq.genNextSeqSplit(PDU);
		this.MessageContentParts.copy(PDU, pos, (i - 1) * 140, i * 140);
		PDU.copy(PDUs, len * (i - 1));
	}

	PDU = PDU.slice(0, len - (140 - remain));
	PDU.writeUInt32BE(PDU.length, 0);
	PDU.writeUInt32BE(remain, pos - 4);
	this.MessageContentParts.copy(PDU, pos, (splits - 1) * 140); // , (splits - 1) * 140 + remain
	PDU.fill(0, PDU.length - 8);
	lastlen = PDU.length;
	PDU.copy(PDUs, len * (splits - 1));
	return PDUs;
}

Submit.addCunnedOptions = function(name, options) {
	cannedOptions[name] = options;
};

Submit.prototype.beforeSend = function() {
	if (this.MessageLength > 140 || this.splits)
		this.options.ScheduleTime = util.afterNow(1);
};

exports = module.exports = Submit;

//unit test
if (process.argv[1] === __filename) {
	process.nextTick(function() {
		var CommandFactory = require('../commands.js');
		var Submit = CommandFactory.create('Submit');
		var submit = new Submit(['15620001781', '15620009233'], 8, 'some content');
		console.log(submit);
		var PDU = submit.makePDU();
		var submitEcho = submit.parse(PDU);
		console.log(PDU.slice(0, 20));
		console.log(PDU.slice(20));
		console.log(submitEcho);
		// var	contentLong = '1234567890123456789012345678901234567890123456789012345678901234567890 password:4644 @http://unidialbook.com/tjuc/register_b.a?rc=4644';
		// var submit = new Submit(['15620001781', '15620009233'], 8, contentLong);
		// console.log(submit);
		// var PDU = submit.makePDU();
		// var submitEcho = submit.parse(PDU);
		// console.log(PDU.slice(0, 20));
		// console.log(PDU.slice(20));
		// console.log(submitEcho);
	});
}