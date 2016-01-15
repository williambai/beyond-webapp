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

Submit.Resp = function() {};
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

/**
 * 
tp_udhiHead[0] = 0x05;// 表示剩余协议头的长度 
tp_udhiHead[1] = 0x00;// 包头类型标识，固定填写0x00，表示长短信 
tp_udhiHead[2] = 0x03;// 子包长度，固定填写0x03，表示后面三个字节的长度； 
//tp_udhiHead[3] = 0x0A;// ：长消息参考号，每个SP给每个用户发送的每条参考号都应该不同，可以从0开始，每次加1，最大255，便于同一个终端对同一个SP的消息的不同的长短信进行识别 
tp_udhiHead[4] = (byte) messageUCS2Count;// 本条长消息的的总消息数，从1到255，一般取值应该大于2 
tp_udhiHead[5] = (byte) number;// 本条消息在长消息中的位置或序号，从1到255，第一条为1，第二条为2，最后一条等于第五字节的值。 
根据网上的资料也将tp_udhi = 1;messageCoding = 8; 
电信SMGP长短信
一、设置tlv字段TP_udhi为0x01，表示消息内容里面包含消息头(也就是说含长短信头) 
二、内容前面需要增加6个字段 
  1、  字节一：包头长度，固定填写0x05； 
  2、  字节二：包头类型标识，固定填写0x00，表示长短信； 
  3、  字节三：子包长度，固定填写0x03，表示后面三个字节的长度； 
  4、  字节四到字节六：包内容： 
  a）  字节四：长消息参考号，每个SP给每个用户发送的每条参考号都应该不同，可以从0开始，每次加1，最大255，便于同一个终端对同一个SP的消息的不同的长短信进行识别； 
  b）  字节五：本条长消息的的总消息数，从1到255，一般取值应该大于2； 
  c）  字节六：本条消息在长消息中的位置或序号，从1到255，第一条为1，第二条为2，最后一条等于第四字节的值。 例子： 

05 00 03 00 02 01 
05 00 03 00 02 02 
三、你还需要设置PkTotal和PkNumber 
这个字段如果不设置并不影响用户手机对短信的拼装，但是会影响ismp的健权和计费，一组pktotal pknumber里面的数据ismp是当一条短信健权和计费。 
特别说明：如果网关方式长短信一定要ucs-2编码，gbk如果发送的短信内容全是全角字符没问题，如果有半角的，很容易乱码。
因为gbk，英文当1个字节；usc-2 中英文都2字节，所以拆分的时候不会出现汉字被截半个的问题
*/