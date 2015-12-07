module.exports = exports = function(mongoose){

	var schema = new mongoose.Schema({

	});

	schema.set('collection','platform.feedbacks');
	return mongoose.model('PlatformFeedback',schema);
};