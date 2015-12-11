module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		name: String,
		nickname: {
			type: String,
			unique: true
		},
		description: String,
		category: String,
		sourceId: {
			type: String,
		},
		status: {
			type: String,
			enum: {
				values: '有效|无效'.split('|'),
				message: 'enum validator failed for path {PATH} with value {VALUE}',
			}
		},
	});

	schema.set('collection','goods.entities');
	return mongoose.model('GoodsEntity',schema);
};