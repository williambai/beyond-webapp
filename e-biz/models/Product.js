exports = module.exports = function(app, config, mongoose, nodemailer){

	var productSchema = new mongoose.Schema({
		slug: {type: String}, //short url
		sku: {type: String},
		name: {type: String},
		description: {type: String},
		details: {
			weight: {type: Number},
			weight_units: {type: String},
			model_num: {type: Number},
			manufacturer: {type: String},
			color: {type: String}
		},
		total_reviews: {type: Number},
		average_review: {type: Number},
		pricing: {
			retail: {type: Number},
			sale: {type: Number}
		},
		price_history: [{
			retail: {type: Number},
			sale: {type: Number},
			start: {type: Date},
			end: {type: Date}
		}],
		category_ids: [{
			type: mongoose.Schema.ObjectId
		}],
		main_cat_id: {type: mongoose.Schema.ObjectId},
		tags: [{
			type: String
		}]
	});

	var categorySchema = new mongoose.Schema({
		slug: {type: String},
		name: {type: String},
		description: {type: String},
		ancestors: [{
			name: {type: String},
			slug: {type: String},

		}],
		parent_id: {
			type: mongoose.Schema.ObjectId
		}
	});

	var orderSchema = new mongoose.Schema({
		user_id: {
			type: mongoose.Schema.ObjectId
		},
		line_items:[productSchema],
		shipping_address: {
			street: {type: String},
			city: {type: String},
			state: {type: String},
			zip: {type: Number}
		},
		sub_total: {type: Number}
	});

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

	var Product = mongoose.model('Product', productSchema);
	var Category = mongoose.model('Category', categorySchema);

	var defaultCallback = function(err){
			if(err){
				return console.log(err);
			}
			return console.log('Save/Remove/Update successfully.');
		};

	var addCategory = function(parentId,options){

		// if(!options.parentIds) options.parentIds = [];
		// var parentId = null;
		// if(options.parentIds.length > 0){
		// 	parentId = _.last(options.parentIds);
		// }

		var category = new Category({
			name: options.name || '',
			description: options.description || '',
			parent_id: parentId,
			ancestors: options.parentIds || []
		});
		category.save(defaultCallback);
	};

	var findCategoryById = function(id, callback){
		Category.findOne({_id:id}, function(err,doc){
			callback(doc);
		});
	};

	var updateCategory = function(id,options){
		Category.where({_id:id}).update({$set: options});
	};

	var removeCategory = function(id){
		Category.remove({_id:id},defaultCallback);
	};

	var findCategoriesById = function(id,callback){
		if(id){
			Category.find({_id:id}, function(err,docs){
				callback(docs);
			});
		}else{
			Category.find({},function(err,docs){
				callback(docs);
			});
		}
	};
	
	var addProduct = function(categoryId,options){
		var product = new Product({
			sku: options.sku,
			name: options.name || '',
			description: options.description || '',
			pricing: {
				retail: options.pricing,
			},
			main_cat_id: categoryId
		});
		product.save(defaultCallback);
	};
	var findProductById = function(id, callback){
		Product.findOne({_id:id}, function(err,doc){
			callback(doc);
		});
	};

	var findProductsByCategoryId = function(categoryId,callback){
		if(categoryId){
			Product.find({main_cat_id:categoryId},function(err,docs){
				callback(docs);
			});
		}else{
			Product.find({},function(err,docs){
				callback(docs);
			})
		}
	};

	return {
		Product: Product,
		Category: Category,
		addProduct: addProduct,
		findProductById: findProductById,
		findProductsByCategoryId: findProductsByCategoryId,
		findCategoryById: findCategoryById,
		addCategory: addCategory,
		updateCategory: updateCategory,
		findCategoriesById: findCategoriesById,
		removeCategory: removeCategory,
	};
};