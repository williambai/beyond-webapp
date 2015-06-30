module.exports = exports = function(app, config,mongoose,nodemailer){
	var debug = true;

	var projectSchema = new mongoose.Schema({
		accountId: {type: mongoose.Schema.ObjectId},
		name: {type: String},
		description: {type: String},
		contacts: [],
		createtime: {type: Date},
		updatetime: {type: Date},
		closed: {type: Boolean}
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
				createtime: new Date(),
				updatetime: new Date(),
				closed: false,
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
			options.updatetime = options.updatetime || new Date();
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

	var close = function(id, callback){
			var set = {
				closed: true,
				updatetime: new Date()
			};
			Project
				.where({_id:id})
				.update({$set: set}, function(err){
					debug && defaultCallback(err);
					if(err){
						callback && callback(null);
					}else{
						callback && callback(true);
					}				
				});
		};

	var open = function(id, callback){
			var set = {
				closed: false,
				updatetime: new Date()
			};
			Project
				.where({_id:id})
				.update({$set: set}, function(err){
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

	var getOpenedByAccountId = function(accountId,page,callback){
			page = (!page || page < 0) ? 0 : page;
			var per = 20;
			if(accountId){
				Project
					.find({accountId:accountId,closed: false})
					.sort({updatetime:-1})
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

	var getByAccountId = function(accountId,page,callback){
			page = (!page || page < 0) ? 0 : page;
			var per = 20;
			if(accountId){
				Project
					.find({accountId:accountId})
					.sort({updatetime:-1})
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
					.sort({updatetime:-1})
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
			Project.findOne({_id:id, closed: false}, function(err,doc){
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
			Project.findOne({_id:id, closed: false}, function(err,doc){
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
		open: open,
		close: close,
		getById: getById,
		getOpenedByAccountId: getOpenedByAccountId,
		getByAccountId: getByAccountId,
		addContactById: addContactById,
		removeContactById: removeContactById,
		getContactById: getContactById,
	};	
};