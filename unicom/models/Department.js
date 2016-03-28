module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		name: String,
		nickname: String,
		address: String,
		zipcode: String,
		website: String,
		manager: String,
		phone: String,
		city: String, //** 城市名称
		grid: String, //** 网格编码
		district: String, //** 地区编码
	});

	schema.set('collection','departments');
	return mongoose.model('Department',schema);
};