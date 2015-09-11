module.exports = exports = function(mongoose){

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

	schema.static.addHistory = function(id,history,callback){
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

	schema.static.addRecord = function(id,record,callback){
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

	return mongoose.model('Order', schema);
};