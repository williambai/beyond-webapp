module.exports = exports = function(app, config,mongoose,nodemailer){
	var order = null;

	var schema = new mongoose.Schema({
			customer: {
				id: String,
				email: String,
				username: String,
			},
			game: {
				ltype: String,
				playtype: String,
				chipintype: Number,
				content: String,
				periods: Number,
				remained: Number,
				sms: String,
			},
			createby: {
				id: String,
				email: String,
				username: String,
			},
			records: [],//records
			status: Number, //0: enable, -1: disable
			expired: Date,
			lastupdatetime: Date,
		});

	var model = mongoose.model('Order', schema);

	var Order = function(model){
		this.model = model;
	};

	Order.prototype.add = function(object,callback){
		callback = callback || function(){};
		var order = new this.model(object);
		order.save(callback);
	};

	Order.prototype.remove = function(id, callback){
		callback = callback || function(){};
		this.model.findByIdAndRemove(id,callback);
	};

	Order.prototype.update = function(id,orderSet,callback){
		callback = callback || function(){};
		this.model.findByIdAndUpdate(
			id,
			{
				$set: orderSet
			},
			callback
		);
	};
	
	Order.prototype.addHistory = function(id,history,callback){
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

	Order.prototype.addRecord = function(id,record,callback){
		callback = callback || function(){};
		this.model.findOneAndUpdate(
			{
				_id: id
			},
			{
				$push: {'records': record}
			},
			callback
		);
	};

	Order.prototype.findById = function(id,callback){
		callback = callback || function(){};
		this.model.findById(id,callback);
	};
	
	Order.prototype.findAll = function(query,page,callback){
		callback = callback || function(){};
		page = (!page || page<0) ? 0 : page;
		var per = 20;
		this.model
			.find(query)
			.skip(per*page)
			.limit(per)
			.exec(callback);
	};

	if(!order){
		order = new Order(model);
	}
	return order;
};