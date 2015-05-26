exports = module.exports = function(app, config, mongoose, nodemailer){

	var userSchema = new mongoose.Schema({
		username: {type: String},
		email: {type: String},
		first_name: {type: String},
		last_name: {type: String},
		hashed_password: {type: String},
		address: [
			{
				name: {type: String},
				street: {type: String},
				city: {type: String},
				state: {type: String},
				zip: {type: Number}
			}
		],
		payment_methods: [{
			name: {type: String},
			last_four: {type: Number},
			crypted_number: {type: Number},
			expiration_date: {type: Date}
		}]
	});
	mongoose.userSchema = userSchema;
};