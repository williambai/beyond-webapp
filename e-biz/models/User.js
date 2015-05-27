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

	var User = mongoose.model('User', userSchema);

	User.findOne({username:'admin'},function(err,doc){
		if(!doc){
			var user = User({
				username: 'admin',
				email: 'admin@test.com',
				address: [{
					name: 'admin',
					street: 'street',
					city: 'city',
					state: 'state',
					zip: 100000
				}],
				payment_methods:[{
					name: 'admin',
					last_four: 1234,
					crypted_number: 123456,
					expiration_date: new Date()
				}]
			});
			user.save();
		}
	});
	User.findOne({username:'user'},function(err,doc){
		if(!doc){
			var user = User({
				username: 'user',
				email: 'user@test.com',
				address: [{
					name: 'user',
					street: 'street',
					city: 'city',
					state: 'state',
					zip: 100000
				}],
				payment_methods:[{
					name: 'user',
					last_four: 1234,
					crypted_number: 123456,
					expiration_date: new Date()
				}]
			});
			user.save();
		}
	});};