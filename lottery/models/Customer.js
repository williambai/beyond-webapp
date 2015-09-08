module.exports = exports = function(app, config,mongoose,nodemailer){
	var customer = null;

	var schema = new mongoose.Schema({
			username: String,
			idno: String,
			mobile: String,
			address: {
				street: String,
				city: String,
				province: String,
				country: String,
				zipcode: String
			},
			banks:[
				{
					bankname: String,
					bankaddr: String,
					username: String,
					account: String,
				}
			],
		});

	var model = mongoose.model('Customer', schema);

	var Customer = function(model){
		this.model = model;
	};

	if(!customer){
		customer = new Customer(model);
	}
	return customer;
};