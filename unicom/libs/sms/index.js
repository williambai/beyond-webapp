var net = require('net');
var CommandFactory = require('./lib/commands');
var Bind = CommandFactory.create('Bind');
var Unbind = CommandFactory.create('Unbind');
var Submit = CommandFactory.create('Submit');

var handler = require('./lib/handler');

// var factory = function(Command){
// 	return function(docs,callback){

// 	};
// };

var sp = {
	// send1: factory(Submit),
	// checkReport1: factory(Report),
	// checkReply1: factory(Reply),
};

sp.send = function(docs, callback) {
	var docs = (docs instanceof Array) ? docs : [docs];
	var _docs = docs.slice(0);
	var doc;
	var newDocs = [];

	var client = net.connect({
		host: 'localhost',
		port: 8124,
	}, function() {
		console.log('client connected.');
		//** send Bind Command
		var bind = new Bind(1, 'william', 'pass');
		client.write(bind.makePDU());
	});

	client.on('bind_resp', function() {
		doc = _docs.pop();
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

		doc = _docs.pop();
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
		client.end();
	});

	client.on('response', function(buf) {
		console.log(buf)
		var response = CommandFactory.parse(buf);
		if(response instanceof Bind.Resp){
			if(response.Result != 0){
				return client.end();
			}
			client.emit('bind_resp');			
		}else if(response instanceof Unbind.Resp){
			client.emit('unbind_resp');

		}else if(response instanceof Submit.Resp){
			client.emit('submit_resp',buf);
		}
	});
	
	client.on('error', function(err){
		//** 有部分错误返回调用
		callback(err,newDocs);
	});
	client.on('timeout', function(){
		//** 有部分错误返回调用
		callback(err,newDocs);
	});
	client.on('data', handler(client));

	client.on('end', function() {
		//** 无错误返回调用
		callback(null, newDocs);
		console.log('client disconnected.');
	});
};

sp.checkReport = function(doc, callback) {
	callback(null, {
		id: '1234567890',
		status: '已确认'
	});
	// callback(null,{id: '1234567890', status: '失败'});
};

sp.checkReply = function(doc, callback) {
	callback(null, {
		id: '1234567890',
		status: '已订购'
	});
	// callback(null,{id: '1234567890', status: '已取消'});
};

exports = module.exports = sp;


//unit test
if(process.argv[1] === __filename){
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
	sp.send(docs,function(err,docs){
		if(err) console.log(err);
		console.log(docs);
	});
}