var sms = require('../index');

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

sms.send(docs,function(err,newDocs){
	if(err) return console.log(err);
	console.log(JSON.stringify(newDocs));
});