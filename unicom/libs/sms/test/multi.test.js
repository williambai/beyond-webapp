var docs = [{
	mobile: '15620001781',
	content: 'some content',
},{
	mobile: '15620001782',
	content: 'some content',		
},{
	mobile: '15620001783',
	content: 'some content',		
}];
var doc;
var newDocs = [];

var config = require('../../../config/sp').SGIP12;
var net = require('net');
var CommandFactory = require('../lib/commands');
var Bind = CommandFactory.create('Bind');
var Unbind = CommandFactory.create('Unbind');
var Submit = CommandFactory.create('Submit');
var handler = require('../lib/handler');

var client = net.connect({
  host: 'localhost', //config.SPHost,
  port: 8124, //config.SPPort,
}, function() {
  console.log('client connected.');
  //** send Bind Command
  var bind = new Bind(1, config.SPUser, config.SPPass);
  client.write(bind.makePDU());
});

client.on('bind_resp', function() {
	doc = docs.pop();
	if(!doc) {
		//** send Unbind
		var unbind = new Unbind();
		client.write(unbind.makePDU());
		return;
	}
	var mobiles = (doc.mobile instanceof Array) ? doc.mobile : [doc.mobile];
	// //** send Submit
	var submit = new Submit(mobiles, 8, doc.content);
	client.write(submit.makePDU());
});

client.on('submit_resp', function(response) {
	//** 保存短信序列号
	var series = new Buffer(12);
	response.copy(series,0,8,20);
	doc.series = series.toString('hex');
	newDocs.push(doc);

	doc = docs.pop();
	if(!doc) {
		//** send Unbind
		var unbind = new Unbind();
		client.write(unbind.makePDU());
		return;
	}
	var mobiles = (doc.mobile instanceof Array) ? doc.mobile : [doc.mobile];
	//** send Submit
	var submit = new Submit(mobiles, 8, doc.content);
	client.write(submit.makePDU());
});

client.on('unbind_resp', function() {
	console.log('------ result ------');
	console.log(newDocs);
  client.end();
});

client.on('response', function(buf) {
  var response = CommandFactory.parse(buf);
  console.log(response);
  if (response instanceof Bind.Resp) {
    if (response.Result != 0) {
      return client.end();
    }
    client.emit('bind_resp');
  } else if (response instanceof Unbind.Resp) {
    client.emit('unbind_resp');

  } else if (response instanceof Submit.Resp) {
    client.emit('submit_resp', buf);
  }
});

client.on('data', handler(client));
