module.exports = exports = function(app,mongoose){

	var schema = new mongoose.Schema({
			pid: String,//project id
			createby: {
				uid: String,
				username: String,
				avatar: String,
			},
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
			comments:[{
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
			voters:[],//accountId
			votes: [],//accountId,username,vote(good or bad)
			good: Number,
			bad: Number,
			score: Number,
			lastupdatetime: Date
		});

	schema.set('collection', 'project.statuses');

	return mongoose.model('ProjectStatus', schema);
};