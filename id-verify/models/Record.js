module.exports = exports = function(app, config,mongoose,nodemailer){
	var recordModel = null;

	var RecordSchema = new mongoose.Schema({
			userId: String,
			username: String,
			type: String,
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

	Record.prototype.add = function(userId, username, type, items, price, stage, content, callback){
		var record = new this.model({
			userId: userId,
			username: username,
			type: type,
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

	Record.prototype.getByTimeline = function(userId,page,callback){
		page = (!page || page<0) ? 0 : page;
		var per = 20;
		this.model
			.find({
				userId: userId
			})
			.sort({updatetime: -1})
			.skip(page*per)
			.limit(per)
			.exec(function(err,records){
			this.debug && this.defaultCallback(err);
			if(err || records.length == 0){
				callback && callback(null);
			}else{
				callback && callback(records);
			}
		});
	};
	if(!recordModel){
		recordModel = new Record(RecordModel);
	}
	return recordModel;
};