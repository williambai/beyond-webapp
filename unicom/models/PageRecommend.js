module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({
		name: String,
		nickname: {
			type: String,
			unique: true,
		},
		subject: String,
		description: String,
		thumb_image_ul: String,
		target_url: String,
		display_sort: Number,
		status: {
			code: {
				type: Number,
				enum: {
					values: '0|1'.split('|'), //1: 有效，0：无效
					message: 'enum validator failed for path {PATH} with value {VALUE}',
				}
			},
			message: {
				type: String,
				enum: {
					values: '有效|无效'.split('|'),
					message: 'enum validator failed for path {PATH} with value {VALUE}',
				}
			}
		},
		lastupdatetime: {
			type: Date,
			default: Date.now
		},
	});

	schema.set('collection','page.recommends');
	return mongoose.model('PageRecommend',schema);
};