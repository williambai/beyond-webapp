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
				urls: {},
				thumbnails: {},
				format: String,
				location: {
					// type: String,
					// coordinates: [Number]
				},
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
			weight: {type: Number, default: 0}, // important index: 0~100
			voters:[String],//accountId
			votes: [{
				uid: String,
				username: String,
				vote: String,
			}],
			good: {type: Number, default: 0},
			bad: {type: Number, default: 0},
			score: {type: Number, default: 0},
			lastupdatetime: {type: Date, default: Date.now}
		});

	schema.set('collection', 'account.statuses');

	return mongoose.model('AccountStatus', schema);
};