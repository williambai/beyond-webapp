var sms = require('../index');

var docs = [{
	mobile: '15692740700',
	content: 'some content',
}];

sms.send(docs,function(err,newDocs){
	if(err) return console.log(err);
	console.log(JSON.stringify(newDocs));
});