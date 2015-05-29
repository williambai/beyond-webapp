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

	var getById = function(id, callback){
			Project.findOne({_id:id}, function(err,doc){
				callback(doc);
			});
		};

	var getByAccountId = function(accountId,callback){
			if(accountId){
				Project.find({accountId:accountId},function(err,docs){
					callback(docs);
				});
			}else{
				Project.find({},function(err,docs){
					callback(docs);
				})
			}
		};

	return {
		Project: Project,
		add: add,
		getById: getById,
		getByAccountId: getByAccountId,
	};	
};