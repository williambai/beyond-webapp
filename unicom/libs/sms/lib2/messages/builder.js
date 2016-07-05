'use strict';

var builder = function(options){
	if(!options){
		options = {};
	}
	var exported = {
		commandMap : {
			bind: 'Bind',
			bindResp: 'BindResp',
		},
		commands: {},
	};

	exported.add = function(key,Command){
		exported.commands[key] = function(arg){
			return new Command(arg,options);
		};
		exported.commands[key]._constructor = Command;
		exported.commands[key].fromBuffer = function(buffer){
			var message = exported.commands[key]();
			message.setPayload(buffer);
			return message;
		};
	};
	
	Object.keys(exported.commandMap).forEach(function(key){
		commands[key] = exported.add(key, require('./commands' + key));
	});
	
	return exported;
}

exports = module.exports = builder;