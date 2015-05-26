exports = module.exports = function(app, config, mongoose, nodemailer){

	var productCommentSchema = new mongoose.Schema({
		product_id: {type: mongoose.Schema.ObjectId},
		user_id: {type: mongoose.Schema.ObjectId},
		username: {type: String},
		date: {type: Date},
		title: {type: String},
		text: {type: String},
		rating: {type: Number},
		helpful_votes: {type: Number},
		voter_ids: [{type: mongoose.Schema.ObjectId}]
	});
	mongoose.productCommentSchema = productCommentSchema;
};
