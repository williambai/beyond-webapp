module.exports = exports = function(app,mongoose){

	var schema = new mongoose.Schema({
			uid: String,
			username: String,
			avatar: String,
			subject: String,
			type: String,//text|image|vioce|video|shortvideo|location|moreimage
			content: {
				subject: String,
				body: String,
				url: String,
				thumbnail: String,
				format: String,
				urls: [],
				location_x: Number,
				location_y: Number,
				scale: Number,
				label: String,
			},
			tags: [],
			comments: [{
				uid: String,
				username: String,
				avatar: String,
				content: {},
				replies: [{
					uid: String,
					username: String,
					avatar: String,
					content: {},
				}]
			}],
			weight: Number, // important index: 0~100
			voters:[String],//accountId
			votes: [{
				uid: String,
				username: String,
				vote: String,
			}],//accountId,username,vote(good or bad)
			good: Number,
			bad: Number,
			score: Number,
			lastupdatetime: Date
		});

	schema.set('collection', 'account.statuses');

	return mongoose.model('AccountStatus', schema);
};