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