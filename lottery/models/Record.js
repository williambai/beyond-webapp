module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
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

	return mongoose.model('Record', schema);
};