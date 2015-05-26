exports = module.exports = function(app, config, mongoose, nodemailer){

	var orderSchema = new mongoose.Schema({
		user_id: {
			type: mongoose.Schema.ObjectId
		},
		line_items:[mongoose.productSchema],
		shipping_address: {
			street: {type: String},
			city: {type: String},
			state: {type: String},
			zip: {type: Number}
		},
		sub_total: {type: Number}
	});
	mongoose.orderSchema = orderSchema;
	
	var Order = mongoose.model('Order', orderSchema);

	var defaultCallback = function(err){
			if(err){
				return console.log(err);
			}
			return console.log('Save/Remove/Update successfully.');
		};

	var add = function(orderObj){
			if(orderObj == req.session.cart){
				var order = new Order({
					line_items: req.session.cart
				});
				order.save(defaultCallback);
			}
		};

	var update = function(id, options){
			Order.where({_id:id}).update({$set: options}, defaultCallback);
		};

	var remove = function(id){
			Order.remove({_id:id}, defaultCallback);
		};

	var getByPage = function(page, callback){
			var per = 20;
			Order.find({},function(err,docs){
				callback(docs);
			}).skip(page*per).limit((per));
		};

	var getById = function(id, callback){
			Order.findOne({_id:id}, function(err,doc){
				callback(doc);
			});
		};

	return {
		Order: Order,
		add: add,
		update: update,
		remove: remove,
		getByPage: getByPage,
		getById: getById,
	}
};