exports = module.exports = function(app,models){
	var xml2Json = require('xml2Json');

	var command2xxx = function(req,res){
		var message = xml2Json(req.body);
		var command = (message.header && message.header.command && message.header.command) || '';
		switch(command){
			case '2000':
				command2000(message,res);
				break;
			case '2001':
				command2001(message,res);
				break;
			case '2002':
				command2002(message,res);
				break;
			case '2003':
				command2003(message,res);
				break;
			case '2004':
				command2004(message,res);
				break;
			default:
		}
	}

	var command2000 = function(message,res){
		res.sendStatus(200);
	}

	var command2001 = function(message,res){
		res.sendStatus(200);
		
	}

	var command2002 = function(message,res){
		res.sendStatus(200);
		
	}

	var command2003 = function(message,res){
		res.sendStatus(200);
		
	}

	var command2004 = function(message,res){
		res.sendStatus(200);
		
	}
/**
 * router outline
 */
 	/**
 	 * lottery callback
 	 */
 	app.post('/lottery/callback', command2xxx);

};
