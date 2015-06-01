module.exports = exports = function(app, config,mongoose,nodemailer){
	var projectSchema = new mongoose.Schema({
		accountId: {type: mongoose.Schema.ObjectId},
		name: {type: String},
		description: {type: String},
		contacts: [mongoose.contactSchema],
		activity: [mongoose.statusSchema], 
	});

	mongoose.projectSchema = projectSchema;

	var Project = mongoose.model('Project', projectSchema);

	var defaultCallback = function(err){
			if(err){
				return console.log(err);
			}
			return console.log('Save/Remove/Update successfully.');
		};
	
	var add = function(accountId,options){
			var project = new Project({
				accountId: accountId,
				name: options.name || '',
				description: options.description || '',
			});
			project.save(defaultCallback);
		};

	var update = function(id, options){
			Project.where({_id:id}).update({$set: options}, defaultCallback);
		};

	var remove = function(id){
			Project.remove({_id:id}, defaultCallback);
		};

	var getById = function(id, callback){
			Project.findOne({_id:id}, function(err,doc){
				callback(doc);
			});
		};

	var getByAccountId = function(accountId,page,callback){
			page = (!page || page < 0) ? 0 : page;
			var per = 20;
			if(accountId){
				Project.find({accountId:accountId},function(err,docs){
					callback(docs);
				}).skip(page*per).limit(per);
			}else{
				Project.find({},function(err,docs){
					callback(docs);
				}).skip(page*per).limit(per);
			}
		};

	return {
		Project: Project,
		add: add,
		remove: remove,
		update: update,
		getById: getById,
		getByAccountId: getByAccountId,
	};	
};