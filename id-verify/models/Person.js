module.exports = exports = function(app, config,mongoose,nodemailer){
	var personModel = null;

	var PersonSchema = new mongoose.Schema({
			card_md5: String,
			card_name: String,
			card_id: String,
			creattime: Date,
			updatetime: Date,
		});

	var PersonModel = mongoose.model('Person', PersonSchema);

	var Person = function(model){
			this.model = PersonModel;
		};

	Person.prototype.debug = true;
	Person.prototype.defaultCallback = function(err){
		if(err){
			return console.log(err);
		}
		return console.log('Person Save/Remove/Update successfully.');
	};

	Person.prototype.add = function(personJson, callback){
		var person = new this.model(personJson);
		person
			.save(function(err){
				this.debug && this.defaultCallback(err);
				if(err){
					callback && callback(null);					
				}else{
					callback && callback(person);
				}
			});	
	};

	Person.prototype.exist = function(card_id, card_name, callback){
		this.model
			.find({
				card_name: card_name,
				card_id: card_id
			})
			.exec(function(err,doc){
				this.debug && this.defaultCallback(err);
				if(err || !doc){
					callback && callback(false);					
				}else{
					callback && callback(true);
				}
			});
	};

	Person.prototype.findOne = function(card_id, card_name, callback){
		this.model
			.findOne({
				card_name: card_name,
				card_id: card_id
			})
			.exec(function(err,doc){
				this.debug && this.defaultCallback(err);
				if(err || !doc){
					callback && callback(null);					
				}else{
					callback && callback(doc);
				}
			});
	};

	Person.prototype.update = function(card_id, card_name, options, callback){
		this.model
			.findOneAndUpdate({
				card_name: card_name,
				card_id: card_id
			},
			{
				$set: options
			},
			function(err,doc){
				this.debug && this.defaultCallback(err);
				if(err || !doc){
					callback && callback(false);					
				}else{
					callback && callback(doc);
				}				
			});
	};

	Person.prototype.findAll = function(pairs, callback){
		this.model
			.find({
				$or: pairs
			})
			.exec(function(err,docs){
				console.log(docs)
				this.debug && this.defaultCallback(err);
				if(err || !docs){
					callback && callback(err,null);					
				}else{
					callback && callback(null,docs);
				}
			});
	};

	if(!personModel){
		personModel = new Person(PersonModel);
	}
	return personModel;
};