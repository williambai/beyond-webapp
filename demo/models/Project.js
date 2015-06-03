module.exports = exports = function(app, config,mongoose,nodemailer){
	var statusSchema = new mongoose.Schema({
			name: {type: String},
			editor: {type: mongoose.Schema.ObjectId},
			status: {type: String}
		});
	var projectSchema = new mongoose.Schema({
		accountId: {type: mongoose.Schema.ObjectId},
		name: {type: String},
		description: {type: String},
		contacts: [],
		status: [statusSchema], 
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

	var addStatusById = function(id,name,editor,text){
		var status = {
			name: name,
			editor: editor,
			status: text
		};
		Project.findOne({_id:id},function(err,doc){
			if(doc){
				doc.status.push(status);
				doc.save(defaultCallback);
			}
		});
	};

	var removeStatusById = function(id,status){
		Project.findOne({_id:id}, function(err,doc){
			if(doc){
				doc.status.pull(status);
				doc.save(defaultCallback);
			}
		})
	};

	var getStatusById = function(id,page,callback){
		id = id || 0;
		page = (!page || page<0) ? 0 : page;
		var per = 20;
		Project.findOne({_id:id}, function(err,doc){
			if(doc){
				callback(doc.status).skip(page*per).limit(per);
			}
		});
	};

	var addContactById = function(id,contactId){
		Project.findOne({_id:id}, function(err,doc){
			if(err){
				defaultCallback(err);
				return;
			}
			if(doc){
				doc.contacts.push(contactId);
				doc.save(defaultCallback);
			}
		});
	};

	var removeContactById = function(id,contactId){
		Project.findOne({_id:id}, function(err,doc){
			if(err){
				defaultCallback(err);
				return;
			}
			if(doc){
				doc.contacts.pull(contactId);
				doc.save(defaultCallback);
			}
		})
	};

	var getContactById = function(id,page,callback){
		id = id || 0;
		page = (!page || page<0) ? 0 : page;
		var per = 20;
		Project.findOne({_id:id},function(err,docs){
			if(docs){
				callback(docs.contacts).skip(page*per).limit(per);
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
		addStatusById: addStatusById,
		removeStatusById: removeStatusById,
		getStatusById: getStatusById,
		addContactById: addContactById,
		removeContactById: removeContactById,
		getContactById: getContactById,
	};	
};