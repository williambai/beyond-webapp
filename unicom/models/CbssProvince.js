var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	province_name: String, //** 省市名
	province_id: String, //** 省市Id
});
schema.set('collection', 'cbss.provinces');

module.exports = exports = function(connection){
	connection = connection || mongoose;
	return connection.model('CbssProvince', schema);
};