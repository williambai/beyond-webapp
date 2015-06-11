module.exports = exports = function(app, config,mongoose,nodemailer){
	var debug = true;

	var projectSchema = new mongoose.Schema({
		accountId: {type: mongoose.Schema.ObjectId},
		name: {type: String},
		description: {type: String},
		contacts: [],
	});

	mongoose.projectSchema = projectSchema;

	var Project = mongoose.model('Project', projectSchema);

	var defaultCallback = function(err){
			if(err){
				return console.log(err);
			}
			return console.log('Project Save/Remove/Update successfully.');
		};
	
	var add = function(accountId,options,callback){
			var project = new Project({
				accountId: accountId,
				name: options.name || '',
				description: options.description || '',
			});
			project.save(function(err){
				debug && defaultCallback(err);
				if(err){
					callback && callback(null);
				}else{
					callback && callback(project);
				}
			});
		};

	var update = function(id, options, callback){
			Project
				.where({_id:id})
				.update({$set: options}, function(err){
					debug && defaultCallback(err);
					if(err){
						callback && callback(null);
					}else{
						callback && callback(true);
					}				
				});
		};

	var remove = function(id,callback){
			Project.remove({_id:id}, function(err){
				debug && defaultCallback(err);
				if(err){
					callback && callback(null);
				}else{
					callback && callback(true);
				}								
			});
		};

	var getById = function(id, callback){
			Project.findOne({_id:id}, function(err,doc){
				debug && defaultCallback(err);
				if(err){
					callback && callback(null);
				}else{
					callback && callback(doc);
				}				
			});
		};

	var getByAccountId = function(accountId,page,callback){
			page = (!page || page < 0) ? 0 : page;
			var per = 20;
			if(accountId){
				Project
					.find({accountId:accountId})
					.skip(page*per)
					.limit(per)
					.exec(function(err,docs){
						debug && defaultCallback(err);
						if(err){
							callback && callback(null);
						}else{
							callback && callback(docs);
						}
					});

			}else{
				Project
					.find({})
					.skip(page*per)
					.limit(per)
					.exec(function(err,docs){
						debug && defaultCallback(err);
						if(err){
							callback && callback(null);
						}else{
							callback && callback(docs);
						}
					});
			}
		};

	var addContactById = function(id,contactId, callback){
			Project.findOne({_id:id}, function(err,doc){
				if(err || doc == null){
					debug && defaultCallback(err);
					callback && callback(null);
					return;
				}
				if(doc){
					doc.contacts.push(contactId);
					doc.save(function(err){
						debug && defaultCallback(err);
						if(err){
							callback && callback(null);
						}else{
							callback && callback(contactId);
						}					
					});
				}
			});
		};

	var removeContactById = function(id,contactId){
			Project.findOne({_id:id}, function(err,doc){
				if(err || doc == null){
					debug && defaultCallback(err);
					callback && callback(null);
					return;
				}
				if(doc){
					doc.contacts.pull(contactId);
					doc.save(function(err){
						debug && defaultCallback(err);
						if(err){
							callback && callback(null);
						}else{
							callback && callback(contactId);
						}					
					});
				}
			})
		};

	var getContactById = function(id,page,callback){
			id = id || 0;
			page = (!page || page<0) ? 0 : page;
			var per = 20;
			Project.findOne({_id:id},function(err,doc){
				debug && defaultCallback(err);
				if(err || doc == null){
					callback && callback(null);
					return;
				}else{
					callback && callback(doc.contacts);
				}
			});
		};

	return {
		Project: Project,
		add: add,
		remove: remove,
		update: update,
		getById: getById,
		getByAccountId: getByAccountId,
		addContactById: addContactById,
		removeContactById: removeContactById,
		getContactById: getContactById,
	};	
};