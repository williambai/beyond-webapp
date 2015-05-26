exports = module.exports = function(app, config, mongoose, nodemailer){

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
	mongoose.categorySchema = categorySchema;
	
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
	var Category = mongoose.model('Category', categorySchema);

	var defaultCallback = function(err){
			if(err){
				return console.log(err);
			}
			return console.log('Save/Remove/Update successfully.');
		};

	var add = function(parentId,options){

		var category = new Category({
			name: options.name || '',
			description: options.description || '',
			parent_id: parentId,
			ancestors: options.parentIds || []
		});
		category.save(defaultCallback);
	};

	var getById = function(id, callback){
		Category.findOne({_id:id}, function(err,doc){
			callback(doc);
		});
	};

	var update = function(id,options){
		Category.where({_id:id}).update({$set: options});
	};

	var remove = function(id){
		Category.remove({_id:id},defaultCallback);
	};

	var getChildrenById = function(id,callback){
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

	return {
		Category: Category,
		getById: getById,
		add: add,
		update: update,
		getChildrenById: getChildrenById,
		remove: remove,
	};
};