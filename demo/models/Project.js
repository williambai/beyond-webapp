module.exports = exports = function(app, config,mongoose,nodemailer){
	var project = null;

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

	var ProjectModel = mongoose.model('Project', projectSchema);

	var Project = function(model){
		this.model = ProjectModel;
	};

	Project.prototype.debug = true;
	Project.prototype.defaultCallback = function(err){
			if(err){
				return console.log(err);
			}
			return console.log('Project Save/Remove/Update successfully.');
		};
	
	Project.prototype.add = function(accountId,options,callback){
			var project = new this.model({
				accountId: accountId,
				name: options.name || '',
				description: options.description || '',
				createtime: new Date(),
				updatetime: new Date(),
				closed: false,
			});
			project.save(function(err){
				this.debug && this.defaultCallback(err);
				if(err){
					callback && callback(null);
				}else{
					callback && callback(project);
				}
			});
		};

	Project.prototype.update = function(id, options, callback){
			options.updatetime = options.updatetime || new Date();
			this.model
				.where({_id:id})
				.update({$set: options}, function(err){
					this.debug && this.defaultCallback(err);
					if(err){
						callback && callback(null);
					}else{
						callback && callback(true);
					}				
				});
		};

	Project.prototype.close = function(id, callback){
			var set = {
				closed: true,
				updatetime: new Date()
			};
			this.model
				.where({_id:id})
				.update({$set: set}, function(err){
					this.debug && this.defaultCallback(err);
					if(err){
						callback && callback(null);
					}else{
						callback && callback(true);
					}				
				});
		};

	Project.prototype.open = function(id, callback){
			var set = {
				closed: false,
				updatetime: new Date()
			};
			this.model
				.where({_id:id})
				.update({$set: set}, function(err){
					this.debug && this.defaultCallback(err);
					if(err){
						callback && callback(null);
					}else{
						callback && callback(true);
					}				
				});
		};

	Project.prototype.remove = function(id,callback){
			this.model.remove({_id:id}, function(err){
				this.debug && this.defaultCallback(err);
				if(err){
					callback && callback(null);
				}else{
					callback && callback(true);
				}								
			});
		};

	Project.prototype.getById = function(id, callback){
			this.model.findOne({_id:id}, function(err,doc){
				this.debug && this.defaultCallback(err);
				if(err){
					callback && callback(null);
				}else{
					callback && callback(doc);
				}				
			});
		};

	Project.prototype.getOpenedByAccountId = function(accountId,page,callback){
			page = (!page || page < 0) ? 0 : page;
			var per = 20;
			if(accountId){
				this.model
					.find({accountId:accountId,closed: false})
					.sort({updatetime:-1})
					.skip(page*per)
					.limit(per)
					.exec(function(err,docs){
						this.debug && this.defaultCallback(err);
						if(err){
							callback && callback(null);
						}else{
							callback && callback(docs);
						}
					});

			}
		};

	Project.prototype.getByAccountId = function(accountId,page,callback){
			page = (!page || page < 0) ? 0 : page;
			var per = 20;
			if(accountId){
				this.model
					.find({accountId:accountId})
					.sort({updatetime:-1})
					.skip(page*per)
					.limit(per)
					.exec(function(err,docs){
						this.debug && this.defaultCallback(err);
						if(err){
							callback && callback(null);
						}else{
							callback && callback(docs);
						}
					});

			}else{
				this.model
					.find({})
					.sort({updatetime:-1})
					.skip(page*per)
					.limit(per)
					.exec(function(err,docs){
						this.debug && this.defaultCallback(err);
						if(err){
							callback && callback(null);
						}else{
							callback && callback(docs);
						}
					});
			}
		};

	Project.prototype.addContactById = function(id,contactId, callback){
			this.model.findOne({_id:id, closed: false}, function(err,doc){
				if(err || doc == null){
					this.debug && this.defaultCallback(err);
					callback && callback(null);
					return;
				}
				if(doc){
					doc.contacts.push(contactId);
					doc.save(function(err){
						this.debug && this.defaultCallback(err);
						if(err){
							callback && callback(null);
						}else{
							callback && callback(contactId);
						}					
					});
				}
			});
		};

	Project.prototype.removeContactById = function(id,contactId,callback){
			this.model.findOne({_id:id, closed: false}, function(err,doc){
				if(err || doc == null){
					this.debug && this.defaultCallback(err);
					callback && callback(null);
					return;
				}
				if(doc){
					doc.contacts.pull(contactId);
					doc.save(function(err){
						this.debug && this.defaultCallback(err);
						if(err){
							callback && callback(null);
						}else{
							callback && callback(contactId);
						}					
					});
				}
			})
		};

	Project.prototype.getContactById = function(id,page,callback){
			id = id || 0;
			page = (!page || page<0) ? 0 : page;
			var per = 20;
			this.model.findOne({_id:id},function(err,doc){
				this.debug && this.defaultCallback(err);
				if(err || doc == null){
					callback && callback(null);
					return;
				}else{
					callback && callback(doc.contacts);
				}
			});
		};
	if(!project){
		project = new Project(ProjectModel);
	}
	return project;
};