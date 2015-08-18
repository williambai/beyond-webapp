module.exports = exports = function(app, config,mongoose,nodemailer){
	var recordModel = null;

	var RecordSchema = new mongoose.Schema({
			userId: String,
			username: String,
			type: String,
			sbm: String,//终端用户识别码
			fsd: String,//终端用户发生地
			ywlx: String,//终端用户业务类型
			items: Number,
			price: Number,
			stage: String,
			salt: String,
			content: String,
			createtime: Date,
			// status: Number, // (>0 正常;<0 异常 0 unknown；) -1 接收但未调用服务器；1 本地接口 2 远程接口 3 部分本地接口
		});

	var RecordModel = mongoose.model('Record', RecordSchema);

	var Record = function(model){
			this.model = RecordModel;
		};

	Record.prototype.debug = true;
	Record.prototype.defaultCallback = function(err){
			if(err){
				return console.log(err);
			}
			return console.log('Record Save/Remove/Update successfully.');
		};

	Record.prototype.add = function(userId, username, type, sbm, fsd, ywlx, items, price, stage, content, callback){
		var record = new this.model({
			userId: userId,
			username: username,
			type: type,
			sbm: sbm,
			fsd: fsd,
			ywlx: ywlx,
			items: items,
			price: price,
			stage: stage,
			content: content,
			createtime: new Date(),
		});
		record
			.save(function(err){
				this.debug && this.defaultCallback(err);
				if(err){
					callback && callback(null);					
				}else{
					callback && callback(record);
				}
			});	
	};

	Record.prototype.getAllByUser = function(userId,page,callback){
		var _default = {
			content: 0
		};
		page = (!page || page<0) ? 0 : page;
		var per = 20;
		this.model
			.find({
				userId: userId
			})
			.select(_default)
			.sort({createtime: -1})
			.skip(page*per)
			.limit(per)
			.exec(callback);
	};

	Record.prototype.findByString = function(userId,searchStr,page,callback){
		page = (!page || page<0) ? 0 : page;
		var per = 20;
		var searchRegex = new RegExp(searchStr,'i');
		this.model
			.find({
				$or: [
					{'card_id': {$regex: searchRegex}},
					{'card_name': {$regex: searchRegex}}
				]
			})
			.where({
				'userId': userId
			})
			.skip(page*per)
			.limit(per)
			.exec(callback);
	};

	if(!recordModel){
		recordModel = new Record(RecordModel);
	}
	return recordModel;
};