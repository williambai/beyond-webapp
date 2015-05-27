exports = module.exports = function(app, config, mongoose, nodemailer){

	var tree = require('./plugins/mongoose-tree');

	var categorySchema = new mongoose.Schema({
		slug: {type: String},
		name: {type: String},
		description: {type: String},
		parent: {type: mongoose.Schema.ObjectId },
		path: {type: String}
	});
	
	categorySchema.plugin(tree);

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
		});

		if(!parentId){
			category.save(defaultCallback);
		}else{
			Category.findOne({_id:parentId}, function(err,doc){
				if(err || !doc){
					defaultCallback(err);
					return;
				}
				console.log('+++++')
				console.log(doc)
				category.parent = doc;
				category.save(defaultCallback);
			});
		}
	};

	var getById = function(id, callback){
		Category.findOne({_id:id}, function(err,doc){
			callback(doc);
		});
	};

	var update = function(id,options){
		console.log(options);
		Category.where({_id:id}).update({$set: options});
	};

	var remove = function(id){
		if(id){
			Category.findOne({_id:id},function(err,doc){
				if(err){
					defaultCallback(err);
					return;
				}
				doc.getChildren(true,function(err,docs){
					doc.getChildren(true,function(err,docs){
						if(err){
							callback(defaultCallback);
							return;
						}
						if(docs && docs.length > 0){
							//非叶节点
							callback(defaultCallback);
						}else{
							//叶节点
							Category.remove({_id:id},defaultCallback);
						}
					});					
				})
			})
		}
	};

	var getChildrenById = function(id,callback){
		if(id){
			Category.findOne({_id:id}, function(err,doc){
				if(err){
					defaultCallback(err);
					return;
				}
				doc.getChildren(true,function(err,docs){
					if(err){
						defaultCallback(err);
						return;
					}
					callback(docs);
				});
			});
		}else{
			Category.find({parent: null} , function(err,docs){
				callback(docs);
			});
		}
	};

	var getAnsestorsById = function(id,callback){
		if(id){
			Category.findOne({_id:id}, function(err,doc){
				if(err){
					callback(defaultCallback);
					return;
				}
				doc.getAnsestors(function(err,docs){
					if(err){
						callback(defaultCallback);
						return;
					}
					callback(docs);
				});
			});
		}else{
			callback(null);
		}
	};

	return {
		Category: Category,
		add: add,
		update: update,
		remove: remove,
		getById: getById,
		getChildrenById: getChildrenById,
		getAnsestorsById: getAnsestorsById,
	};
};