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
	
	mongoose.productSchema = productSchema;

	var Product = mongoose.model('Product', productSchema);

	var defaultCallback = function(err){
			if(err){
				return console.log(err);
			}
			return console.log('Save/Remove/Update successfully.');
		};
	
	var add = function(categoryId,options){
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
	var getById = function(id, callback){
		Product.findOne({_id:id}, function(err,doc){
			callback(doc);
		});
	};

	var getByCategoryId = function(categoryId,callback){
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
		add: add,
		getById: getById,
		getByCategoryId: getByCategoryId,
	};
};