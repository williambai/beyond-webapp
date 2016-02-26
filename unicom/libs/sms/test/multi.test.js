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
var StreamSpliter = require('../lib/StreamSpliter');

var _send = function(docs){
	//** send sms
	doc = docs.pop();
	if(!doc) {
		console.log('<< 4. submit_resp');
		//** send Unbind
		var unbind = new Unbind();
		client.write(unbind.makePDU());
		console.log('>> 5. unbind');
		return;
	}
	var mobiles = (doc.mobile instanceof Array) ? doc.mobile : [doc.mobile];
	//** send Submit
	var submit = new Submit(mobiles, 8, doc.content);
	client.write(submit.makePDU());
};

var client = net.connect({
  host: 'localhost', //config.SPHost,
  port: config.SPPort,
}, function() {
  console.log('client connected.');
});

client.on('bind_resp', function() {
	console.log('<< 2. bind_resp');
	_send(docs);
	console.log('>> 3. submit');
});

client.on('submit_resp', function(response) {
	//** 保存短信序列号
	var series = new Buffer(12);
	response.copy(series,0,8,20);
	doc.series = series.toString('hex');
	newDocs.push(doc);
	//** send sms
	_send(docs);
});

client.on('unbind_resp', function() {
	console.log('<< 6. unbind_resp');
	console.log('------ result ------');
	console.log(newDocs);
	client.end();
});

var handler = new StreamSpliter(client);

handler.on('message', function(buf) {
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

//** send Bind Command
var bind = new Bind(1, config.SPUser, config.SPPass);
client.write(bind.makePDU());
console.log('>> 1.bind');

