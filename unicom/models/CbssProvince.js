module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		province_name: String,//** 省市名
		province_id: String, //** 省市Id
	});

	schema.set('collection','cbss.provinces');
	return mongoose.model('CbssProvince',schema);
};