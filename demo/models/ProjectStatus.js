module.exports = exports = function(app,mongoose){

	var schemaOptions = {
			toJSON: {
				virtuals: true
			},
			toObject: {
				virtuals: true
			}
		};


	var schema = new mongoose.Schema({
			pid: String,//project id
			createby: {
				uid: String,
				username: String,
				avatar: String,
			},
			type: {
				type: String, 
				enum: 'text|file|image|link|mixed|voice|video|shortvideo|location|email'.split('|')
			},
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
			secret: Boolean, //false: public or true: private(default)
			lastupdatetime: Date
		});

	schema.virtual('score').get(function(){
		return (this.good - this.bad);
	});

	schema.set('collection', 'project.statuses');

	return mongoose.model('ProjectStatus', schema);
};