module.exports = exports = function(app, config,mongoose,nodemailer){
	var record = null;

	var schema = new mongoose.Schema({
		});

	var model = mongoose.model('Record', schema);

	var Record = function(model){
		this.model = model;
	};

	Record.prototype.add = function(object,callback){
		callback = callback || function(){};
		var record = new this.model(object);
		record.save(callback);
	};

	Record.prototype.remove = function(id, callback){
		callback = callback || function(){};
		this.model.findByIdAndRemove(id,callback);
	};

	Record.prototype.update = function(id,recordSet,callback){
		callback = callback || function(){};
		this.model.findByIdAndUpdate(
			id,
			{
				$set: recordSet
			},
			callback
		);
	};

	Record.prototype.addHistory = function(id,history,callback){
		callback = callback || function(){};
		this.model.findOneAndUpdate(
			{
				_id: id
			},
			{
				$push: {'histroies': history}
			},
			callback
		);
	};

	Record.prototype.findById = function(id,callback){
		callback = callback || function(){};
		this.model.findById(id,callback);
	};

	Record.prototype.findAll = function(query,page,callback){
		callback = callback || function(){};
		page = (!page || page<0) ? 0 : page;
		var per = 20;
		this.model
			.find(query)
			.skip(per*page)
			.limit(per)
			.exec(callback);
	};

	if(!record){
		record = new Record(model);
	}
	return record;
};