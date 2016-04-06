//** 同一时间不重复的序列号
var curSeq = 0xffffffff;

//** 产生下一个序列号，为长短信留出十个分批发送的序列号
var genNextSeq = function() {
	curSeq = (curSeq > 0x7fffff00) ? 0 : curSeq + 10;
	return curSeq;
};
//** 获取当前时间
var getCurrentTime = function(){
	var d = new Date();
	var mTime = 0;
	mTime = mTime * 100 + (d.getMonth() + 1);
	mTime = mTime * 100 + d.getDate();
	mTime = mTime * 100 + d.getHours();
	mTime = mTime * 100 + d.getMinutes();
	mTime = mTime * 100 + d.getSeconds();
	return mTime;
};
//** SP配置文件
var spConfig = require('../config/sp').SGIP12;

module.exports = exports = function(mongoose) {

	var schema = new mongoose.Schema({
		header: { //** SMS 发送时的头。包括源节点，时间戳和序列号
			srcNodeID: Number, 
			cmdTime: Number, 
			cmdSeq: Number
		},
		headerSeries: String, //** srcNodeID + cmdTime + cmdSeq
		sender: String,
		receiver: String,
		content: String,
		status: {
			type: String,
			enum: {
				values: '新建|已发送|已确认|收到|已处理|失败'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		},
		createBy: {
			id: String,
			name: String,
		},
		lastupdatetime: {
			type: Date,
			default: Date.now
		},		
	});

	//** save
	schema.pre('save', function(next){
		//** 收到的SMS直接存储，不做改动
		if(this.status != '收到'){
			//** 没有设置SMS头
			if(!this.headerSeries){
				this.header = {};
				this.header.srcNodeID = spConfig.NodeID;
				this.header.cmdTime = getCurrentTime();
				this.header.cmdSeq = genNextSeq();
				this.headerSeries = this.header.srcNodeID + '' + this.header.cmdTime + '' + this.header.cmdSeq;
			}
			//** 没有设置sender, 采用默认的SPNumber作为发送方
			if(!this.sender){
				this.sender = spConfig.options.SPNumber;
			}else{
				this.sender = spConfig.options.SPNumber + '' + this.sender;
			}
			//** 没有设置status, 默认的status
			if(!this.status){
				this.status = '新建';
			}
		}
		//** 保证短信少于140个英文字符或70个汉字
		// var content = this.content || '';
		// var len = this.content.length;
		// var isChinese = false;
		// for(var i=0; i<len; i++){
		// 	//** 判断含有中文字符
		// 	if(content.charCodeAt(i) > 127) {
		// 		isChinese = true;
		// 		break;
		// 	}
		// }
		// if(isChinese){
		// 	this.content = content.slice(0,70);
		// }else{
		// 	this.content = content.slice(0,70);
		// }
		next();
	});

	schema.set('collection', 'platform.smses');
	return mongoose.model('PlatformSms', schema);
};