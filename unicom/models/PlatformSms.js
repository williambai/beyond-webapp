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

	schema.set('collection', 'platform.smses');
	return mongoose.model('PlatformSms', schema);
};