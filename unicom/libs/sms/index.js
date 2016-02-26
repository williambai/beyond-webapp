var CommandFactory = require('./lib/commands');
var StreamSpliter = require('./lib/StreamSpliter');

var send = function(docs, done) {
	var doc;
	var newDocs = [];
	var config = require('../../config/sp').SGIP12;
	var net = require('net');
	var CommandFactory = require('./lib/commands');
	var Bind = CommandFactory.create('Bind');
	var Unbind = CommandFactory.create('Unbind');
	var Submit = CommandFactory.create('Submit');
	var StreamSpliter = require('./lib/StreamSpliter');

	var client = net.connect({
		host: config.SPHost,
		port: config.SPPort,
	}, function() {
		console.log('client connected.');
		//** send Bind Command
		var bind = new Bind(1, config.SPUser, config.SPPass);
		client.write(bind.makePDU());
	});

	client.on('error', function(err) {
		console.log(err);
		client.end();
		done && done(err);
	});

	client.on('timeout', function(err) {
		console.log(err);
		client.end();
		done && done(err);
	});

	var handler = new StreamSpliter(client);

	handler.on('message', function(buf) {
		var command = CommandFactory.parse(buf);
		// console.log(command);
		if (command instanceof Bind.Resp) {
			if (command.Result != 0) {
				return client.end();
			}
			//** send sms
			doc = docs.pop();
			if (!doc) {
				//** send Unbind
				var unbind = new Unbind();
				client.write(unbind.makePDU());
				return;
			}
			var mobiles = (doc.mobile instanceof Array) ? doc.mobile : [doc.mobile];
			// //** send Submit
			var submit = new Submit(mobiles, 8, doc.content);
			client.write(submit.makePDU());
		} else if (command instanceof Unbind.Resp) {
			//** unbind
			client.end();
			done && done(null, newDocs);
		} else if (command instanceof Submit.Resp) {
			//** 保存command
			doc.command = command;
			newDocs.push(doc);
			//** send sms
			doc = docs.pop();
			if (!doc) {
				//** send Unbind
				var unbind = new Unbind();
				client.write(unbind.makePDU());
				return;
			}
			var mobiles = (doc.mobile instanceof Array) ? doc.mobile : [doc.mobile];
			//** send Submit
			var submit = new Submit(mobiles, 8, doc.content);
			client.write(submit.makePDU());
		}
	});
};

exports = module.exports = {
	CommandFactory: CommandFactory,
	StreamSpliter: StreamSpliter,
	send: send,
};