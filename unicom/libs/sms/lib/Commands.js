var sequence = require('./sequence');

var CommandFactory = {};

CommandFactory.create = function(commandType) {

	var defaultFactory = function(){
		var defaultCommand = function(){

		};
		defaultCommand.code = 0x0;
		defaultCommand.PDUAttrSeq = [];
		return defaultCommand;
	};

	var Command = (commandType != undefined) ? require('./cmds/cmd' + commandType) : defaultFactory();

	/**
	 * default PDU length computator if there is no variale length attr or multi occurence attr for the PDU type
	 * particular PDU types have it's own overrided method
	 * @return {*}
	 */
	Command.prototype.getPDULength = function() {
		var len = 0;
		Command.PDUAttrSeq.forEach(function(attr,i){
			attr && (len += attr.len);
		});
		return len + (this.MessageLength || 0);
	};

	Command.prototype.makePDU = function(reqPDU,NodeID) {
		var that = this;
		var PDULen = 20 + that.getPDULength() + 8;
		var	PDU, sPtr;
		
		PDU = new Buffer(PDULen);
		PDU.writeUInt32BE(PDULen, 0);
		PDU.writeUInt32BE(Command.code, 4);
		if (reqPDU) {
			reqPDU.copy(PDU, 8, 8, 20);
		} else {
			sequence.genNextSeq(PDU, NodeID);
		}
		sPtr = 20;

		var attrs = Command.PDUAttrSeq;
		var count = false;
		var	j, loopPos;
		that.beforeSend && that.beforeSend(); // Warning: must execute after setting PDU time in unique 3 4UIntBE sequence
		for (var i = 0, aLen = attrs.length; i < aLen; i++) {
			var attr = attrs[i];
			if (!attr) {
				// end of array once
				if (++j < count) {
					i = loopPos;
				} else {
					count = false;
				}
				continue;
			}
			var aname = attr.name;
			var val = count ? that[aname][j] : that[aname];
			if (attr.name){
				//** 属性名称存在，在没有设置值的情况下，采用默认值
				if (val === undefined) val = that.options[attr.name];
			}
			//** 根据属性的类型，填入buffer不同
			switch (attr.type) {
				case 'text':
					//** 文本属性，按照文本长度填入buffer
					(function(len) {
						var bytesWriten;
						if (len) {
							//*** 如果属性定义了长度
							//** 更新PDU数据
							bytesWriten = PDU.write(val, sPtr, len, 'utf8');
							//** 更新总长度
							PDU.fill(0, sPtr + bytesWriten, sPtr + len);
							//** 更新当前指针
							sPtr += len;
							// console.log(PDU.slice(sPtr, sPtr + len));
						} else {
							//*** 属性没有定义长度
							// console.log('++++')
							// console.log(val);
							// console.log(sPtr);
							// for attr that length is determined by its instance length, not by its type's fixed length
							// for example MessageContent attr in Submit PDU
							bytesWriten = val.copy(PDU, sPtr);
							// bytesWriten = PDU.write(val,sPtr,val.length,'utf8');
							//** 更新当前指针
							sPtr += val.length;
						}
					})(attr.len);
					break;

				case 'integer':
					switch (attr.len) {
						case 1:
							//** 1字节，针对Count和UserCount属性
							PDU.writeUInt8(val, sPtr);
							if (aname.substr(-5) === 'Count') {
								count = val;
								loopPos = i;
								j = 0;
							}
							break;
						case 4:
							//** 4字节
							PDU.writeUInt32BE(val, sPtr);
							break;
						case 12:
							//** 12字节
							PDU.writeUInt32BE(val, sPtr);
					}
					//** 更新当前指针
					sPtr += attr.len;
					break;
			}
		}
		//** 填充保留字
		PDU.fill(0, sPtr);
		if (that.splits) {
			//** Submit 长内容组织成多条短信相关
			return that.PDU = that.followParts(PDU);
		}
		return PDU;
	};

	Command.prototype.parse = CommandFactory.parse;
	return Command;
};

/**
 * 解析对象
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
CommandFactory.parse = function(data) {
	var cmdID = data.readUInt32BE(4);
	var isResp = false;
	if (cmdID > 0x80000000){
		isResp = true;
		cmdID = cmdID - 0x80000000;
	}
	var commandType;
	switch(cmdID){
		case 0x1: 
			commandType = 'Bind';
			break;
		case 0x2: 
			commandType = 'Unbind';
			break;
		case 0x3: 
			commandType = 'Submit';
			break;
		case 0x4: 
			commandType = 'Deliver';
			break;
		case 0x5: 
			commandType = 'Report';
			break;
		default:
			break;	
	}
	var PDULen = data.readUInt32BE(0);
	if(!commandType) return {
		code: '0x' + cmdID.toString(16),
		errmsg: '0x' + cmdID.toString(16) + ' command不支持',
	};
	var Message;
	if(isResp){
		//** 是Command Resp对象
		Message = require('./cmds/cmd' + commandType).Resp;
	}else{
		//** 是Command对象
		Message = require('./cmds/cmd' + commandType);
	}
	//** 创建对象
	var	msg = new Message();
	//** 获取对象属性序列集合
	var	PDUAttrSeq = Message.PDUAttrSeq;
	
	var	ptr = 20,
		varLen, prevName, count, j, loopPos;
	//** 读取前20个字节，解析为对象头
	msg.header = sequence.readSeq(data);

	for (var i = 0, aLen = PDUAttrSeq.length; i < aLen; i++) {
		var attr = PDUAttrSeq[i],
			aname, val;
		if (!attr) {
			if (++j < count) {
				i = loopPos;
			} else {
				count = false;
			}
			continue;
		}
		//** 获取属性名称
		aname = attr.name;
		if (attr.type === 'text') {
			//** 属性类型为文本
			if (attr.len) {
				//** 将data的当前指针+文本长度之间的文本读出，并转化为UTF8格式
				val = data.toString('utf8', ptr, ptr + attr.len); // todo: encoding may not be utf8
				// console.log('string length for %s is %d', aname, val.length);
				//** 如果包含\u0000字符，截断字符串
				var zeroPos = val.indexOf("\u0000");
				~zeroPos && (val = val.slice(0, zeroPos));
				//** 更新指针
				ptr += attr.len;
			} else {
				//*** 属性是可变长度
				//** 前一个属性定义的是本字符串的长度，取出长度
				varLen = msg[PDUAttrSeq[i - 1].name];
				//** 取出字符串，并转化为UTF8格式？？？
				// val = data.toString('utf8', ptr, ptr + varLen); // todo: encoding may not be utf8
				val = new Buffer(data.slice(ptr, ptr + varLen));
				// console.log('varLen', varLen, aname, val);
				//** 更新指针
				ptr += varLen;
			}
		} else if (attr.type = 'integer') {
			switch (attr.len) {
				case 1:
					//** 1字节，针对Count和UserCount属性
					val = data.readUInt8(ptr);
					if (aname.substr(-5) === 'Count') {
						count = val;
						j = 0;
						loopPos = i;
						msg[aname] = count;
						ptr++;
						continue;
					}
					break;
				case 4:
					val = data.readUInt32BE(ptr);
					break;
				case 12:
					//** TODO?
					val = sequence.readSeq(data, ptr);
					break;
			}
			//** 更新指针
			ptr += attr.len;
		}
		if (count) {
			if (j)
				msg[aname].push(val);
			else
				msg[aname] = [val];
		} else {
			msg[aname] = val;
		}
	}
	return msg;
};

exports = module.exports = CommandFactory;

//unit test
if (process.argv[1] === __filename) {
	var util = require('util');
	var NoneMessage = CommandFactory.create();
	// console.log(NoneMessage.prototype);
	var BindMessage = CommandFactory.create('Bind');
	// console.log(util.inspect(BindMessage.prototype));
	var bindMessage = new BindMessage(1, 'william', 'pass');	
	// console.log(bindMessage.makePDU());
}